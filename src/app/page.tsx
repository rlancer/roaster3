'use client'

import axios from 'axios';
import { useState } from 'react';
import { ColorRing } from 'react-loader-spinner'

type OpenAIResponse = {
  choices: {
    message: {
      content: string
    }
  }[];
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

type Poeple = {
  short_visual_description: string
  joke: string
  position: string
}

type JokesResponse = {
  people: Poeple[]
}

export default function Vision() {
  const [response, setResponse] = useState<JokesResponse | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


  const roast = async (base64: string) => {
    setLoading(true);

    const res = await axios.post<JokesResponse>('/api/vision', {
      base64,
    }, { timeout: 60 * 1000 * 2 });

    setResponse(res.data);
    setLoading(false);
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    setFile(e.target.files[0]);
    const base64 = await toBase64(e.target.files[0] as File);
    setBase64(base64 as string);

    await roast(base64 as string)
  };



  const onClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.value = "";
  };

  return (
    <div className="page-container">
      <h1>AI Roaster </h1>
      <p>Upload a photo with people</p>
      <br />


      <br />

      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        onClick={onClick}
      />


      <div style={{ maxWidth: '600px' }}>
        {base64 && (
          <img src={base64} style={{ maxWidth: 800 }} alt="Uploaded Image" />
        )}
      </div>

      {loading && <div>

        <p>roasting ...</p>
        <iframe src="https://giphy.com/embed/1AunKpz3cdCpy" width="480" height="362" frameBorder="0" className="giphy-embed" ></iframe>

      </div>}


      {!loading && response && <>{response.people.map(r =>
        <div key={r.position} style={{ marginTop: '1rem' }}>
          <div style={{ fontWeight: 'bold' }}>{r.position} &middot; {r.short_visual_description}</div>
          <div>{r.joke}</div>
        </div>
      )}</>}


    </div>
  );
}

