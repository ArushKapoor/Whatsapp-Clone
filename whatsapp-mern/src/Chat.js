import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";
import {
  AttachFile,
  InsertEmoticon,
  Mic,
  MoreVert,
  SearchOutlined,
  Close,
} from "@material-ui/icons";
import { Avatar, IconButton } from "@material-ui/core";
import { useStateValue } from "./StateProvider";
import axios from "./axios";
import Picker from "emoji-picker-react";

function Chat({ messages }) {
  const [input, setInput] = useState("");
  const [isShowEmojiPicker, setIsShowEmojiPicker] = useState(false);
  const [{ user }, dispatch] = useStateValue();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    await axios.post("/api/v1/messages/new", {
      message: input,
      name: user?.displayName,
      timestamp: new Date().toUTCString(),
      uid: user?.uid,
    });
    setInput("");
  };

  const onEmojiClick = (event, emojiObject) => {
    setInput(input + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setIsShowEmojiPicker(!isShowEmojiPicker);
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />

        <div className="chat__headerInfo">
          <h3>Room Name</h3>
          <p>Last seen at...</p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.map((message, index) => (
          <p
            key={index}
            className={`chat__message ${
              user?.uid === message.uid && "chat__receiver"
            }`}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">{message.timestamp}</span>
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {isShowEmojiPicker && <Picker onEmojiClick={onEmojiClick} />}

      <div className="chat__footer">
        {isShowEmojiPicker ? (
          <IconButton onClick={toggleEmojiPicker}>
            <Close />
          </IconButton>
        ) : (
          <IconButton onClick={toggleEmojiPicker}>
            <InsertEmoticon onClick={toggleEmojiPicker} />
          </IconButton>
        )}
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <Mic />
      </div>
    </div>
  );
}

export default Chat;
