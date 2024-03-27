from flask import Flask, request
from flask_cors import CORS, cross_origin
import PyPDF2
import os
from openai import OpenAI
from dotenv import load_dotenv
import requests
import datetime
import pdfplumber

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OpenAI.api_key = OPENAI_API_KEY
client = OpenAI()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
load_dotenv()

@app.route("/")
@cross_origin()
def home():
  return "Hello World!"

@app.route("/upload", methods=['POST'])
@cross_origin()
def get_response():
  file = request.files['file']
  pdf_reader = PyPDF2.PdfReader(file)
  max_font_size = 0
  max_font_text = ""
  with pdfplumber.open(file) as pdf:
    pages = pdf.pages
    for page in pages:
      largest_size = max([float(line['size']) for line in page.chars])
      if largest_size > max_font_size:
        max_font_size = largest_size
        largest_text = ''
        for line in page.chars:
          if float(line['size']) == largest_size:
            largest_text += line['text']
        max_font_text = largest_text

  num_pages = len(pdf_reader.pages)
  abstract_text = ""
  for i in range(num_pages):
    page = pdf_reader.pages[i]
    text = page.extract_text()
    virtual_text1 = text.casefold()
    if "abstract" in virtual_text1:
      abstract_text = text
      break
  virtual_text2 = abstract_text.casefold()
  start_index = virtual_text2.find("abstract")
  end_index = virtual_text2.find(".\n", start_index) + 2
  substring = abstract_text[start_index:end_index]
  
  response_text = client.chat.completions.create(                                                      
    model="gpt-3.5-turbo",
    temperature=0.2,
    messages=[
      {"role": "system", "content": "List only 8-10 clear and simple summary bullet points to create an infographic from prompt in numerical order.These bullet points will be used for propmts generating AI images."},
      {"role": "user", "content": substring}
    ]
  )
  bullet_pattern = r'\n\d+\.'
  bullet_points = [item.strip() for item in response_text.choices[0].message.content.split(bullet_pattern) if item.strip()]
  summary = bullet_points[0]
  prompt_list = summary.split("\n")  
  return {"prompt_list": prompt_list, "title": max_font_text}

@app.route("/bullet", methods=['POST'])
@cross_origin()
def get_initialPrompt():
  bullet = request.json['bullet']
  response = client.chat.completions.create(                                                      
    model="gpt-3.5-turbo",
    temperature=0.2,
    messages=[
      {"role": "system", "content": "Create an prompt to generate an AI image for infographics from the text"},
      {"role": "user", "content": bullet}
    ]
  )
  return response.choices[0].message.content

@app.route("/image", methods=['POST'])
@cross_origin()
def get_imageGeneration():
  prompt = request.json["prompt"]
  response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        n=1,
        size="1024x1024",
        quality="standard",
      )
  ImgURL = response.data[0].url
  return ImgURL

@app.route("/download", methods=['POST'])
@cross_origin()
def downloadImage():
  imgURL = request.json["imgUrl"]
  response = requests.get(imgURL)
  name1 = str(datetime.datetime.now())
  name2 = name1.replace(":", "")
  name3 = name2.replace(" ", "")
  name4 = name3.replace(".", "")
  name5 = name4.replace("-", "")
  if not os.path.exists("public"):
    os.makedirs("public")
  img_name = "public/" + name5 + ".jpg"
  with open(img_name, 'wb') as f:
    f.write(response.content)
  return "ok"
  
if __name__ == "__main__":
    app.run()
