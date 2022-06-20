import React, { useEffect, useState } from "react";
import "./App.css";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import Pusher from "pusher-js";
import axios from "./axios";
import Login from "./Login";
import { useStateValue } from "./StateProvider";
import DefaultScreen from "./DefaultScreen";

function App() {
  const [messages, setMessages] = useState([]);
  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/messages/sync").then((response) => {
      setMessages(response.data);
    });

    axios.get("/api/v1/chatrooms/sync").then((response) => {
      setChatrooms(response.data);
    });
  }, []);

  // console.log("Chatrooms ", chatrooms);
  // console.log("Messages ", messages);

  useEffect(() => {
    const pusher = new Pusher("d70b311cec9d09ede019", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  useEffect(() => {
    const pusher = new Pusher("d70b311cec9d09ede019", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("chatrooms");
    channel.bind("inserted", (newChatroom) => {
      setChatrooms([...chatrooms, newChatroom]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chatrooms]);

  const [{ user, selectedChatroom }, dispatch] = useStateValue();

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app_body">
          <Sidebar chatrooms={chatrooms} />
          {selectedChatroom ? <Chat messages={messages} /> : <DefaultScreen />}
        </div>
      )}
    </div>
  );
}

export default App;
