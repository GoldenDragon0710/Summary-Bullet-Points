# Summary Bullet Points

Summary Bullet Points is a tool for creating infographics.

- Load multiple PDF files
- Parse PDF to extract title and abstract, edit titles and download as Word document.
- Generate 8~10 bullet points from the abstract using ChatGPT
- Create/edit new prompt for AI image generation using ChatGPT
- Generate and download AI images.

### Frontend

```sh
npm install
npm run dev
```

### Backend (Python v3.10.9)

```sh
py -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
flask run --debug --port=5000 --host=0.0.0.0
```

## PDF Parsing and extracting the text using `PyPDF2` (v3.0)

```sh
import PyPDF2

pdf_reader = PyPDF2.PdfReader(file)
num_pages = len(pdf_reader.pages)
for i in range(num_pages):
    page = pdf_reader.pages[i]
    text = page.extract_text()
```

## Extracting font size of the text in PDF using `pdfplumer`

```sh
import pdfplumber

with pdfplumber.open(file) as pdf:
    pages = pdf.pages
    for page in pages:
      font_size = ([float(line['size']) for line in page.chars])
```

## Integrating ChatGPT with `text-davinci-003` model

```sh
import openai

response = openai.Completion.create(
    prompt=prompt,
    model="text-davinci-003",
    max_tokens=1024,
    temperature=0.2,
)
print(response.choices[0].text)
```

## Generating AI images using `OpenAI DALL-E` model

```sh
import openai

response = openai.Image.create(
    prompt=prompt,
    n=1,
    size="1024x1024",
    response_format="url"
);
ImgURL = response['data'][0]['url']
```

## Download the text into Word Document in `React.js`

```sh
const text = "Hello World!";
const blob = new Blob([text], {
  type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
});

const href = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = href;
link.download = 'Hello.docx';
link.click();
```

## Download the image with URL

```sh
import requests

response = requests.get(imgURL)
if not os.path.exists("public"):
  os.makedirs("public")
with open("image.jpg", 'wb') as f:
  f.write(response.content)
```

## Reference URLs

- [pdfplumber](https://github.com/jsvine/pdfplumber)
- [tabula](https://github.com/chezou/tabula-py/blob/master/examples/tabula_example.ipynb)
