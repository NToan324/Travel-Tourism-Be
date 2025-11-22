// import mongoose from "mongoose";

// import config from "@/configs/app.config";

// type DB = "mongo" | "mysql";

// class Database {
//   constructor() {
//     this.connect();
//   }

//   public static instance: Database;

//   connect(type: DB = "mongo") {
//     switch (type) {
//       case "mongo":
//         mongoose
//           .connect(config.db.connectionString)
//           .then(() => {
//             const NODE_ENV = process.env.NODE_ENV || "dev";
//             console.log(`[Database - ${NODE_ENV}] Connected to MongoDB`);
//           })
//           .catch((error) => {
//             console.log("🚀 ~ Database ~ connect ~ error:", error);
//             console.error("[Error] Error connecting to MongoDB");
//           });
//         break;
//       case "mysql":
//         break;
//       default:
//         break;
//     }
//   }

//   static getInstance() {
//     if (!Database.instance) {
//       Database.instance = new Database();
//     }
//     return Database.instance;
//   }
// }

// const instanceMongodb = Database.getInstance();
// export default instanceMongodb;


// init.mongodb.ts
import mongoose from "mongoose";
import config from "@/configs/app.config";

function createConnection(uri: string, name: string) {
  const conn = mongoose.createConnection(uri);

  conn.on("connected", () => {
    console.log(`[Database] Connected to ${name} DB successfully`);
  });

  conn.on("error", (error) => {
    console.error(`[Database] Error connecting to ${name} DB:`, error);
  });

  return conn;
}

// Tạo connection cho Chat DB (chứa chat_sessions)
export const chatDbConnection = createConnection(config.db.chatURI, "Chat");

// Tạo connection cho Tourism DB (chứa attractions, cities...)
export const tourismDbConnection = createConnection(config.db.connectionString, "Tourism");