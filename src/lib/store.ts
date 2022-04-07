import { writable } from "svelte/store";

const message = writable<any>("");

const deferredMessages = [];
let socket: WebSocket;

const sendMessage = async (message) => {
  if (socket.readyState == 0) {
    deferredMessages.push(message);
  }
  if (socket.readyState == 1) {
    message = JSON.stringify(message);
    socket.send(message);
  }
};

export default {
  connect: (room: string) => {
    socket = new WebSocket(`ws://localhost:8000/${room}`);
    socket.addEventListener("open", function (event) {
      console.log("Connected to engine");
      for (const msg of deferredMessages) {
        sendMessage(msg);
      }
    });
    socket.addEventListener("message", function (event) {
      message.set(event.data);
    });
  },
  disconnect: () => {
    socket.close();
  },
  subscribe: message.subscribe,
  sendMessage,
};
