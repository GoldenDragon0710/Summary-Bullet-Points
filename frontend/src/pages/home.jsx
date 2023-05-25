import React, { useState } from 'react'
import axios from 'axios';
import {
  Textarea,
  Button,
  Avatar,
  Typography,
  Select,
  Option,
  Input,
} from "@material-tailwind/react";
import {MyLoader} from "@/widgets/loader/MyLoader";
import {
  notification,
  List
} from "antd";

export function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [bulletPoints, setBulletPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgURL, setImgURL] = useState("/img/openai.svg");
  const [prompt, setPrompt] = useState("");
  const [fileList, setFilelist] = useState(null);
  const [fileNameList, setFileNameList] = useState([]);
  const [title, setTitle] = useState("");

  const fileChangehandler = (event) => {
    const list = event.target.files;
    const filenameList = [];
    for (let i=0;i<list.length;i++) {
      filenameList.push(list[i].name);
    }
    setFileNameList(filenameList);
    setFilelist(list);
  };

  const handleFileChange = (val) => {
    setSelectedFile(fileList[val]);
  };

  const saveDocument = () => {
    let text = title + "\n\n";
    bulletPoints.map(item => {
      text += "\n" + item + "\n";
    });
    const blob = new Blob([text], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
  
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    const download_name = fileName.substring(0, fileName.length - 4);
    link.download = download_name + '.docx';
    link.click();
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFile) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      setFileName(selectedFile.name);
      axios.post('http://localhost:5000/upload', formData)
        .then((res) => {
          setBulletPoints(res.data.prompt_list);
          setTitle(res.data.title);
          setLoading(false);
          notification.success({message: "Successfully generated summary bullet points."});
        })
        .catch((error) => {
          setLoading(false);
          notification.error({message: "Failed to generate summary bullet points."});
          console.log(error);
        });
    } else {
      notification.warning({message: "No file selected"});
    }
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleBulletClick = (value) => {
    const bullet = value;
    setLoading(true);
    axios.post('http://localhost:5000/bullet', {bullet: bullet})
    .then((res) => {
      setPrompt(res.data);
      setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
      console.log(error);
    });
  };

  const handleCreateImage = () => {
    setLoading(true);
    console.log(prompt);
    axios.post('http://localhost:5000/image', {prompt: prompt})
    .then((res) => {
      setImgURL(res.data);
      setLoading(false);
      notification.success({message: "Successfully generated AI image."});
    })
    .catch((error) => {
      setLoading(false);
      notification.error({message: "Failed to generate AI image."});
      console.log(error);
    });
  };
  
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const downloadImage = () => {
    setLoading(true);
    axios.post('http://localhost:5000/download', {imgUrl: imgURL})
    .then((res) => {
      setLoading(false);
      notification.success({message: "Successfully download."});
    })
    .catch((error) => {
      setLoading(false);
      notification.error({message: "Failed to download."});
      console.log(error);
    });
  };

  return (
    <>
      <div className="relative flex h-screen content-center items-center justify-center">
        <div className="absolute top-0 h-full w-full bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80')] bg-cover bg-center" />
        {
          loading && (<MyLoader isloading={loading}/>)
        }
        <div className="absolute top-0 h-full w-full bg-black/75 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center w-full">
            <form onSubmit={handleSubmit} className='w-1/2'>
              <div className="mx-auto w-full bg-white opacity-80 rounded px-4 pt-8 text-center">
                <div className='w-full mb-5'>
                  <Typography className="font-bold text-xl">
                    Bullet Points
                  </Typography>
                </div>
                <div className="mb-3 px-32 pb-2">
                  <input
                    className="relative m-0 block w-full border-t min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                    id="formFileLg"
                    onChange={fileChangehandler}
                    type="file"
                    multiple
                  />
                </div>
                <div className='mb-3'>
                  <Select label='Select a file' onChange={handleFileChange}>
                    {
                      (fileNameList.length != 0) ? fileNameList.map((item, idx) => {
                        return(
                          <Option key={idx} value={idx}>{idx+1}. {item}</Option>
                        );
                      }) : (<></>)
                    }
                  </Select>
                </div>
		<div className='w-full my-5'>
                  <Textarea 
                    variant="standard" 
                    label="Title" 
                    value={title} 
                    onChange={handleTitleChange} 
                    className='text-xl'
                  />
                </div>
                <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800 max-h-[22rem] overflow-y-auto">
                    <List
                      size="large"
                      bordered
                      dataSource={bulletPoints}
                      renderItem={(item) => 
                        <List.Item
                          className='text-left bg-white hover:cursor-pointer hover:bg-blue-gray-300' 
                          onClick={() => handleBulletClick(item)}
                          value={item}
                        >
                          {item}
                        </List.Item>}
                    />
                  </div>
                  <div className="flex items-center justify-end px-5 py-5 border-t dark:border-gray-600">
                    <Button size="md" type='submit' className='mx-2'>Generate</Button>
                    <Button size="md" onClick={saveDocument} className='mx-2'>Download</Button>
                  </div>
                </div>
              </div>
            </form>
            <div className='flex justify-center items-center w-1/2'>
              <div className='mx-auto w-full bg-white opacity-80 rounded px-4 pt-8 text-center lg:w-8/12'>
                <div className='w-full mb-5'>
                  <Typography className="font-bold text-xl">
                    AI Image Generation
                  </Typography>
                </div>
                <div className='w-64 h-64 rounded border-solid border-2 border-neutral-500 my-5 mx-auto'>
                  <Avatar src={imgURL} alt="avatar" variant="rounded" className='w-full h-full'/>
                </div>
                <div className='w-full'>
                  <Textarea 
                    label="Prompt" 
                    onChange={handlePromptChange}
                    value={prompt}
                  />
                  <div className="flex items-center justify-end px-5 py-5 border-t dark:border-gray-600">
                    <Button size="md" onClick={handleCreateImage} className='mx-2'>Generate Image</Button>
                    <Button size="md" onClick={downloadImage} className='mx-2'>Download Image</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
