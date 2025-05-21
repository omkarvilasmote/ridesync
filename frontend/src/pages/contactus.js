import React, { useState } from 'react';
import axios from 'axios';

function ContactUS() {
  const [userInput, setUserInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!userInput.trim()) return;

    setChatLog([...chatLog, { type: 'user', message: userInput }]);
    setIsLoading(true);

    getBotReply(userInput).then((reply) => {
      setChatLog((prev) => [...prev, { type: 'bot', message: reply }]);
      setIsLoading(false);
    });

    setUserInput('');
  };

  const getBotReply = async (input) => {
    const options = {
      method: 'POST',
      url: 'https://lemurbot.p.rapidapi.com/chat',
      headers: {
        'x-rapidapi-key': '20a2b212bdmsh1141e459470930bp10f6b0jsn2927162d7223',
        'x-rapidapi-host': 'lemurbot.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        bot: 'dilly',
        client: 'd531e3bd-b6c3-4f3f-bb58-a6632cbed5e2',
        message: input
      }
    };

    try {
      const response = await axios.request(options);
      const output = response?.data?.data?.conversation?.output;
      return output || 'No reply from bot.';
    } catch (error) {
      console.error('API error:', error);
      return 'Something went wrong. Please try again later.';
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Contact Us</h2>

        <div className="h-[400px] overflow-y-auto border border-gray-300 rounded-md p-3 mb-4 bg-gray-50">
          {chatLog.map((chat, index) => (
            <div
              key={index}
              className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div
                className={`px-4 py-2 rounded-lg text-sm max-w-xs ${chat.type === 'user' ? 'bg-green-100' : 'bg-blue-100'
                  }`}
              >
                {chat.message}
              </div>
            </div>
          ))}
        </div>

        <div className="flex">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ask us anything..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactUS;
