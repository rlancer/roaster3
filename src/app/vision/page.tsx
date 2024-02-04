'use client'

import axios from 'axios';
import { useState } from 'react';

type OpenAIResponse = {
  choices: { message: {
    content: string
  } }[];
};

const toBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export default function Vision() {
  const [response, setResponse] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [base64, setBase64] = useState<string | null>(null);


  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
  
    setFile(e.target.files[0]);
    const base64 = await toBase64(e.target.files[0] as File);
    setBase64(base64 as string);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!file) {
      return;
    }

    const base64 = await toBase64(file as File);
    setBase64(base64 as string);
  
    const res = await axios.post<OpenAIResponse>('/api/vision', {
      base64,
      prompt
    });

    setResponse(res.data.choices[0].message.content);
  };
  const onClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.value = "";
  };

  return (
    <div className="page-container">
        <p>This is a demo of the OpenAI vision API. Try uploading an image and providing an instruction on how to handle that image.</p>
        <br />
        <hr />
        <br />
        <form method="POST" encType="multipart/form-data" onSubmit={handleFormSubmit}>
        <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            onClick={onClick}
        />
        <textarea placeholder="Provide a user prompt" value={prompt} onChange={e => {setPrompt(e.target.value);}} />
        <br />
        <button type="submit">Upload</button>
        </form>
        <div style={{maxWidth: '600px'}}>
            {base64 && (
                <img src={base64} alt="Uploaded Image" />
            )}
        </div>
        <p>{response}</p>
    </div>
  );
}

