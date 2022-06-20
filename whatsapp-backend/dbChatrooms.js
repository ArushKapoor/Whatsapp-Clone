import mongoose from "mongoose";

const chatroomsSchema = mongoose.Schema({
  name: String,
});

// Collection
export default mongoose.model("chatrooms", chatroomsSchema);
