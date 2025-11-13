import { type Server as SocketServer, type Socket } from "socket.io";

class SocketService {
  private io: SocketServer;

  constructor(io: SocketServer) {
    this.io = io;
  }

  public setupListeners(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log(`[Socket] User connected: ${socket.id}`);

      this.registerChatEvents(socket);
      this.registerUserEvents(socket);

      socket.on("disconnect", () => {
        console.log(`[Socket] User disconnected: ${socket.id}`);
      });
    });
  }

  private registerChatEvents(socket: Socket) {
    socket.on("chat:message", (data) => {
      console.log(`[Chat] Message received: ${data}`);
      this.io.emit("chat:message", data);
    });
  }

  private registerUserEvents(socket: Socket) {
    socket.on("user:typing", (username) => {
      console.log(`[User] ${username} is typing...`);
      socket.broadcast.emit("user:typing", username);
    });
  }
}

export default SocketService;
