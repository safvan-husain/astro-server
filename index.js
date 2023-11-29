import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { authRoutes } from "./src/routes/authentication_route.js";
import { astrologistAuthRoute } from "./src/routes/astrologist_auth_route.js";
import bodyParser from "body-parser";
import http from "http";
import { onWebSocket } from "./src/websocket/websocket_setup.js";
import { userRoute } from "./src/routes/user_route.js";
import { chatRoute } from "./src/routes/chat_route.js";
import { SheduleRoute } from "./src/routes/shedule_route.js";
import { walletRouter } from "./src/routes/wallet_route.js";import { adminRouter } from "./src/routes/admin_route.js";
import cors from 'cors';
   
dotenv.config();

const app = express();
const server = http.createServer(app); 

const port = process.env.PORT || 3000;

const DB = process.env.DataBase;

app.use(bodyParser.json()); 
app.use(cors()); 
app.use(authRoutes);
app.use(walletRouter  );
app.use(SheduleRoute);
app.use(astrologistAuthRoute);
app.use(userRoute);
app.use(chatRoute );
app.use(adminRouter );

mongoose
  .connect(DB)
  .then(() => {
    console.log("connected to database");
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

onWebSocket(server);
