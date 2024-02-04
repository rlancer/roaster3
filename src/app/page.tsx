import Link from "next/link";

export default function Home() {
  return (
    <div className="page-container">
      <h1>Welcome to the GPT Workshop</h1>
      <p>This repo contains the demo code for a React/NextJS application</p>
      <p>You can go to the <Link href="/chat">chat example</Link> to see a demo chatbot</p>
      <p>You can go to the <Link href="/vision">vision example</Link> to see a demo using the vision API</p>
    </div>
  );
}

