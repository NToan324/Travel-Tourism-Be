import { type Server as SocketServer } from "socket.io";

class SocketInstance {
  private static io: SocketServer;

  public static init(io: SocketServer) {
    this.io = io;
  }

  public static getIO(): SocketServer {
    if (!this.io) {
      throw new Error("Socket.io has not been initialized!");
    }
    return this.io;
  }
}

export default SocketInstance;
