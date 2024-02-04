'use client'

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="page-container">
        <p>This is a demo chat app, and it uses the <code>useChat</code> hook <a href="https://sdk.vercel.ai/docs/api-reference/use-chat" target="_blank">from Vercel</a>. To change the system prompt, check out <code>api/chat</code> </p>
        <br />
        <hr />
        <br />
        <div>
            {messages.map(m => (
                <div key={m.id}>
                    <strong>{m.role}:</strong> {m.content}
                </div>
            ))}

            <form onSubmit={handleSubmit}>
                <strong>user: </strong>
                <input
                    value={input}
                    placeholder="Say something..."
                    onChange={handleInputChange}
                />
            </form>
        </div>
    </div>
  );
}

