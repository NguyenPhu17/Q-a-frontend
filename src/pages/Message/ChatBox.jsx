import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3009");

export default function ChatBox({ friend, initialMessages = [] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const messagesContainerRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (!userId || !friend?.id) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:3009/api/messages/history/${userId}/${friend.id}`);
        const data = await res.json();
        const formatted = data.map((msg) => ({
          ...msg,
          fromMe: msg.sender_id === userId,
        }));
        setMessages(formatted);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử tin nhắn:", error);
      }
    };

    fetchHistory();
  }, [userId, friend?.id]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3009/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data?.data?.id) {
          setUserId(data.data.id);
        } else {
          console.error("Không lấy được ID người dùng");
        }
      } catch (error) {
        console.error("Lỗi khi lấy profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 50);
  }, [messages]);

  useEffect(() => {
    if (!userId) return;

    socket.emit("joinRoom", userId);

    socket.on("newMessage", (message) => {
      if (
        (message.sender_id === friend.id && message.receiver_id === userId) ||
        (message.sender_id === userId && message.receiver_id === friend.id)
      ) {
        setMessages((prev) => [...prev, { ...message, fromMe: message.sender_id === userId }]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [userId, friend.id]);

  const sendMessage = async (text) => {
    if (!text.trim() || !userId) return;

    const formData = new FormData();
    formData.append("sender_id", userId);
    formData.append("receiver_id", friend.id);
    formData.append("text", text);

    try {
      const res = await fetch("http://localhost:3009/api/messages/send", {
        method: "POST",
        body: formData,
      });

      const newMessage = await res.json();
      setMessages((msgs) => [...msgs, { ...newMessage, fromMe: true }]);
      setInput("");
    } catch (err) {
      console.error("Gửi tin nhắn thất bại", err);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/") || !userId) return;

    const formData = new FormData();
    formData.append("sender_id", userId);
    formData.append("receiver_id", friend.id);
    formData.append("text", "");
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3009/api/messages/send", {
        method: "POST",
        body: formData,
      });

      const newMessage = await res.json();
      setMessages((msgs) => [...msgs, { ...newMessage, fromMe: true }]);
    } catch (err) {
      console.error("Gửi ảnh thất bại", err);
    }

    e.target.value = null;
  };

  const handleAttachFile = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file || !userId) return;

      const formData = new FormData();
      formData.append("sender_id", userId);
      formData.append("receiver_id", friend.id);
      formData.append("text", "");
      formData.append("file", file);

      try {
        const res = await fetch("http://localhost:3009/api/messages/send", {
          method: "POST",
          body: formData,
        });

        const newMessage = await res.json();
        setMessages((msgs) => [...msgs, { ...newMessage, fromMe: true }]);
      } catch (err) {
        console.error("Gửi file thất bại", err);
      }
    };

    fileInput.click();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!userId) return <div className="text-center p-4">Đang tải...</div>;

  return (
    <div
      className="flex flex-col w-full max-w-screen-lg mx-auto border rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-white"
      style={{
        height: 'calc(100vh - 90px)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-4 px-5"
        style={{
          height: 60,
          background: "linear-gradient(90deg, #2c7be5, #1c54b2)",
          flexShrink: 0,
          flexGrow: 0,
          flexBasis: 60,
        }}
      >
        <div className="relative group">
          <img
            src={friend.avt}
            alt={friend.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg transition-transform duration-200 ease-in-out group-hover:scale-110"
          />
          <span
            className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white bg-green-400 animate-pulse"
            title="Online"
          />
        </div>
        <div className="text-white font-extrabold text-xl drop-shadow-lg select-none">
          {friend.name}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 bg-gray-100 space-y-4"
        style={{ minHeight: 0 }}
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
            {msg.image_url ? (
              // Nếu là ảnh thì render trực tiếp không bọc trong khung có nền
              <img
                src={msg.image_url}
                alt="img"
                className="w-full max-w-md h-auto object-contain rounded-2xl shadow-md my-1"
              />
            ) : (
              // Nếu là text hoặc file đính kèm thì dùng khung như cũ
              <div
                className={`max-w-[60%] px-6 py-4 rounded-2xl whitespace-pre-wrap break-words shadow-md ${msg.fromMe ? "bg-blue-600 text-white" : "bg-white text-gray-900"}`}
                style={{ wordBreak: "break-word" }}
              >
                {msg.file_url ? (
                  <a
                    href={msg.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white underline"
                  >
                    📎 Tệp đính kèm
                  </a>
                ) : (
                  msg.text
                )}

                <div className="text-xs text-blue-200 mt-1 text-right select-none">
                  {new Date(msg.time_sent).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>


      {/* Input area */}
      <div
        className="p-4 border-t flex items-center gap-3 bg-white rounded-b-xl"
        style={{
          flexShrink: 0,
          flexGrow: 0,
          flexBasis: 'auto',
        }}
      >
        <button
          onClick={handleAttachFile}
          title="Tạo file đính kèm"
          className="p-2 rounded-md hover:bg-blue-100 transition"
        >
          📎
        </button>
        <button
          onClick={() => imageInputRef.current.click()}
          title="Tải ảnh lên"
          className="p-2 rounded-md hover:bg-blue-100 transition"
        >
          🖼️
        </button>
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Nhập tin nhắn..."
          className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          style={{ maxHeight: 120, fontSize: 16, lineHeight: "1.4em" }}
        />
        <button
          onClick={() => sendMessage(input)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition select-none"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}