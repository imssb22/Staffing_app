"use client";
import axios from "axios";
import { useState, useEffect, useRef, FormEvent } from "react";
import { useParams } from "next/navigation";
import type { RootState } from '../../../../../public/store';
import { useSelector } from 'react-redux';
import dotenv from "dotenv";
dotenv.config();

interface Chat {
  id?: string;
  name_of_creator: string;
  message: string;
  room_id: string;
  createdAt?: string | Date;
  creation_time?: string | Date;
}


export default function Chat() {
  const username = useSelector((state: RootState) => state.auth.username);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const roomId = useParams().id as string;
  const wsRef = useRef<WebSocket | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [message, setMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getChats = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chatroom/${roomId}`);
        setChats(response.data);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      }
    };
    getChats();
  }, [roomId]);

  useEffect(() => {
    if (!username || !userId || !roomId)
      {console.log("I am Returning");
      return;}

      console.log(username + " " + userId + " " + roomId)
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to chat server');
      ws.send(JSON.stringify({
        type: "join",
        username,
        userId,
        payload: {
          roomId
        }
      }));
    };

    ws.onmessage = (event) => {
      try {
        const newChat = JSON.parse(event.data);
        setChats((prevChats) => [...prevChats, newChat]);
      } catch (error) {
        console.error("Invalid message format:", event.data, error);
      }
    };

    // ws.onerror = () => {
    //   console.error("WebSocket encountered an error (event not detailed).");
    // };

    ws.onclose = () => {
      console.warn("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [roomId, userId, username]);
  

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log("1. "+ wsRef.current)
      console.log("2. "+ wsRef.current?.readyState)
      console.log("3. " + WebSocket.OPEN )
      return};

    const chatData = {
      type: "chat",
      userId,
      username,
      payload: { message },
    };

    wsRef.current.send(JSON.stringify(chatData));

    setChats(prev => [
      ...prev,
      {
        name_of_creator: username || "Unknown User",
        message,
        room_id: roomId,
        createdAt: new Date(),
      }
    ]);
    setMessage('');
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden min-h-0 flex-grow">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 shadow-md border-b border-gray-700 shrink-0">
        <h1 className="text-2xl font-bold text-blue-500">Chat Room: {roomId}</h1>
        <p className="text-sm text-gray-400">Logged in as: {username}</p>
      </div>
  
      {/* Chat messages */}
      <div
        ref={chatContainerRef}
        className=" overflow-y-auto px-40 py-4 space-y-4 flex-grow"
      >
        {chats.map((chat, index) => (
          <div
            key={chat.id || index}
            className={`flex ${chat.name_of_creator === username ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`w-fit max-w-lg p-3 rounded-xl shadow-md transition-transform ${
              chat.name_of_creator === username
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                : 'bg-gray-700 text-white'
            }`}>
              <div className="text-xs font-medium mb-1 text-gray-300">{chat.name_of_creator}</div>
              <p className="text-base break-words">{chat.message}</p>
              <p className="text-[10px] text-right text-gray-400 mt-1">
              {new Date(chat.createdAt || chat.creation_time || '').toLocaleTimeString()}

              </p>
            </div>
          </div>
        ))}
      </div>
  
      {/* Input box */}
      
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 px-4 py-3"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300"
          >
            Send
          </button>
        </div>
      </form>
      
    </div>
  );
  
}
