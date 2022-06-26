import axios from "axios";

const instance = axios.create({
  baseURL: "https://whatsapp-clone666.herokuapp.com",
});

export default instance;
