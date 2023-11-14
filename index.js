
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {authRoutes} from './src/routes/authentication_route.js';
import bodyParser from 'body-parser';
import http from 'http';
import { onWebSocket } from './src/websocket/websocket_setup.js' ;


dotenv.config();

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;


const DB = process.env.DataBase;

app.use(bodyParser.json());
app.use(authRoutes);
app.use('/auth', authRoutes);

mongoose.connect(DB).then(() => {
    console.log('connected to database'); 
}).catch((e) => {
    console.log(e);
})

app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


onWebSocket(server);