// importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Chatrooms from "./dbChatrooms.js";
import Pusher from "pusher";
import cors from "cors";

// app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1414254",
  key: "d70b311cec9d09ede019",
  secret: "ec421c281739c25bf7d2",
  cluster: "ap2",
  useTLS: true,
});

// middleware
app.use(express.json());

app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origins", "*");
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   next();
// });

// DB config
const connection_url =
  "mongodb+srv://admin:umCqULeM96hoE4OT@cluster0.3rfac.mongodb.net/whatsappbackend?retryWrites=true&w=majority";

mongoose
  .connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful"))
  .catch((e) => console.log("failed", e))
  .finally(() => console.log("DB Running"));

const db = mongoose.connection;

db.once("open", () => {
  console.log("Connecting DB");

  const msgCollection = db.collection("messages");
  const chatroomCollection = db.collection("chatrooms");

  const msgStream = msgCollection.watch();
  const chatroomStream = chatroomCollection.watch();

  msgStream.on("change", (change) => {
    console.log("A change occurred in messages", change);

    if (change.operationType == "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        uid: messageDetails.uid,
        chatroomId: messageDetails.chatroomId,
      });
    } else {
      console.log("Error triggering Pusher in messages");
    }
  });

  chatroomStream.on("change", (change) => {
    console.log("A change occurred in chatrooms", change);

    if (change.operationType == "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("chatrooms", "inserted", {
        name: messageDetails.name,
      });
    } else {
      console.log("Error triggering Pusher in chatrooms");
    }
  });
});

// api routes
app.get("/", (req, res) => res.status(200).send("hello world"));

app.get("/api/v1/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/api/v1/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(`new message created: \n ${data}`);
    }
  });
});

app.get("/api/v1/chatrooms/sync", (req, res) => {
  Chatrooms.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/api/v1/chatrooms/new", (req, res) => {
  const chatroom = req.body;

  Chatrooms.create(chatroom, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(`new chatroom created: \n ${data}`);
    }
  });
});

// listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));
