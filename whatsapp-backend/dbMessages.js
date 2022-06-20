import mongoose from "mongoose";

const messagesSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
  uid: String,
  chatroomId: String,
});

// Collection
export default mongoose.model("messages", messagesSchema);
