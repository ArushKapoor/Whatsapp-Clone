import React, { useState } from "react";
import "./Sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from "./SidebarChat";
import { useStateValue } from "./StateProvider";

function Sidebar({ chatrooms }) {
  const [filter, setFilter] = useState("");
  const [{ user }, dispatch] = useStateValue();

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search or start a new chat"
            type="text"
          />
        </div>
      </div>

      <div className="sidebar__chats">
        <SidebarChat addNewChat={true} />
        {chatrooms
          ?.filter((chatroom) =>
            chatroom?.name?.toLowerCase()?.includes(filter?.toLowerCase())
          )
          ?.map((chatroom, index) => (
            <SidebarChat key={index} chatroom={chatroom} />
          ))}
      </div>
    </div>
  );
}

export default Sidebar;
