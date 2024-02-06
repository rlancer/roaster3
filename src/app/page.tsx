'use client'

import axios from 'axios';
import { useState } from 'react';

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

// {\n' +
//     '  "people": [\n' +
//     '    {\n' +
//     '      "short_visual_description": "Wears printed top",\n' +
//     `      "joke": "Looks like someone raided their grandma's closet and thought, 'Vintage chic!' More like vintage shriek when she sees you've turned her favorite tablecloth into a top!",\n` +
//     '      "position": "Left"\n' +
//     '    }

export default function Vision() {
  const [response, setResponse] = useState<JokesResponse | null>(null);
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

    const res = await axios.post<JokesResponse>('/api/vision', {
      base64,
      prompt
    });
    console.log('data', res.data);
    setResponse(res.data);
  };

  const onClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.value = "";
  };
  console.log('response', response);

  return (
    <div className="page-container">
      <h1>An Attentive Roaster </h1>
      <p>Upload a photo of people to roast</p>
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
        <button type="submit">Upload</button>
      </form>
      <div style={{ maxWidth: '600px' }}>
        {base64 && (
          <img src={base64} alt="Uploaded Image" />
        )}
      </div>

      {response && <>{response.people.map(r =>
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontWeight: 'bold' }}>{r.position} &middot; {r.short_visual_description}</div>
          <div>{r.joke}</div>
        </div>
      )}</>}


    </div>
  );
}

