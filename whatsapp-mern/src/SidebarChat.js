import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
import axios from "./axios";

function SidebarChat({ chatroom, addNewChat }) {
  const [seed, setSeed] = useState("");
  const [{ selectedChatroom }, dispatch] = useStateValue();

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const handleChatroomChange = () => {
    dispatch({
      type: actionTypes.SET_CHATROOM,
      selectedChatroom: chatroom,
    });
  };

  // console.log(chatroom._id + " " + chatroom.name);
  // console.log(selectedChatroom);

  const createChat = async () => {
    const roomName = prompt("Please enter name for chatroom");

    if (roomName) {
      await axios.post("/api/v1/chatrooms/new", {
        name: roomName,
      });
    }
  };

  return !addNewChat ? (
    <div
      className={`sidebarChat ${
        selectedChatroom &&
        chatroom?._id === selectedChatroom?._id &&
        "sidebarChat__selected"
      }`}
      onClick={handleChatroomChange}
    >
      <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
      <div className="sidebarChat__info">
        <h2>{chatroom?.name}</h2>
        <p>This is last message</p>
      </div>
    </div>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add New Chat</h2>
    </div>
  );
}

export default SidebarChat;
