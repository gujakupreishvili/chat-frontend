import { io } from "socket.io-client";
import { Cookies } from "react-cookie";

const cookies = new Cookies();
const token = cookies.get("token");

const socket = io("http://localhost:3001", {

  auth: { token },
  withCredentials: true,
});

export default socket;
