import React from "react";
import io from "socket.io-client";
const token = localStorage.getItem("token");
export const socket = io("http://192.168.1.64:5000/", { query: { token } });

export const SocketContext = React.createContext();
