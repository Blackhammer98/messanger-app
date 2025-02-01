import express from 'express'
import { WebSocketServer , WebSocket } from 'ws'
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes"


dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);
const httpServer = app.listen(8080)

const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  ws.send('Hello! Message From Server!!');
});