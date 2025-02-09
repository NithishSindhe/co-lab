import express from 'express';
import uWS from 'uWebSockets.js';
import bodyParser from 'body-parser'
import {checkUserExists, createUser, updateGoogleUser} from './db/user_actions.js'
import axios  from 'axios';
import mysql from 'mysql2/promise'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config();
import {sign_token, verify_token, refresh_token, verify_refresh_token, sign_refresh_token} from './auth/jwt.js'

const pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'coLab'
});
console.log('created a connection pool for mysql')

import cors from 'cors';
import cookieParser from 'cookie-parser'
const port = 3000
const app = express()
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    origin: "http://localhost:5173",
    credentials: true 
}));
app.use(bodyParser.json());
//app.use(function(req, res, next) {
//  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Replace with your client's origin (e.g. http://localhost:3001 if your client runs on port 3001)
//  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Essential for credentials
//  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Allow the necessary methods
//  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow necessary headers (e.g., if you're using Authorization headers)
//  next();
//});

app.get('/bitArray', function (req, res) {
	const getRandomColor = () => {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	};
	var twoD = new Array(100)
    .fill(null)
    .map(() => new Array(100).fill(null).map(getRandomColor));
    //twoD = new Array(10).fill('#000000').map(() => new Array(10).fill('#000000'))
    const response = {colors:twoD}
    res.send(response)
})

app.post('/update_kanban', function(req, res) {
    const data = req.body
})

import { get_kanban } from './db/kanban.js'
app.get('/kanban', async function (req, res){
    let email = req.query?.email
    //jwt and auth before sending information is pending
    if(!email) return res.status(400).json({ error: 'email is required' }); 
    email = email.trim()
    const [response, sql_status] = await get_kanban({email:email,connection_pool:pool})
    if(sql_status){
        return res.status(200).json({cards:response})
    }
    return res.status(500).json({ error: 'Internal server error' }); // Send a 500 Internal Server Error
})

app.post('/kanban_update', function (req,res) {
    
})

app.post('/login', async function(req, res){
    try {
        const googleAccessToken = req.body?.access_token;
        if (!googleAccessToken) {
          return res.status(400).json({ error: 'Access token is required' }); 
        }
        const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleAccessToken}`,{
            headers: {
                Authorization: `Bearer ${googleAccessToken}`,
                Accept: 'application/json'
            }
        })
        console.log(`response: ${JSON.stringify(response[0])}`)
        const userExist = await checkUserExists({google_id: response.data.id, connection_pool:pool})
        if(!userExist){
            const userCreateResponse = await createUser({profile_pic:response.data.picture, google_id:response.data.id, userName:response.data.name, createAt:new Date().toLocaleString(), email:response.data.email, verified_email:response.data.verified_email, picture:response.data.picture, connection_pool:pool})
            console.log(`user creation response ${userCreateResponse}`)
        }else{
            await updateGoogleUser({profile_pic:response.data.picture, google_id:response.data.id, userName:response.data.name, createAt:new Date().toLocaleString(), email:response.data.email, verified_email:response.data.verified_email, picture:response.data.picture, connection_pool:pool})
        }
        try{
            const accessToken = await sign_token({data:{profile_pic:response.data.picture, email:response.data.email, user_name:response.data.name}, validity_duration:'15m'})
            const refreshToken = await sign_refresh_token({data:{profile_pic:response.data.picture, email:response.data.email, user_name:response.data.name}, validity_duration:'7d'})
			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV !== "development",
				sameSite: "Strict",
				maxAge: 7 * 24 * 60 * 60 * 1000,
                domain: "localhost",
                path: "/",
			  });
            return res.status(200).json({access_toke:accessToken, name: response.data.name, picture: response.data.picture});
        }
        catch(error){
            console.error('Failed to sign access or refresh token: ', error) 
            return res.status(500).json({error: 'unable to sign in user'})
        }
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ error: 'Internal server error' }); 
    }
})

app.post('/auth',(req,res) => {
    const helper = async () => {
        try{
            const refresh_token = req.cookies?.refreshToken;
            const response = await verify_refresh_token({token: refresh_token})
            // if refresh token is valid then return a fresh valid auth token
            const data = {...response}
            delete data['iat']
            delete data['exp']// if not deleted this will override validity specified at the function function
            const newAuthToken = await sign_token({data:data, validity_duration:'15m'})
            return res.status(200).json({access_token:newAuthToken, user_info:data})
        }
        catch(error){
			if (error instanceof jwt.JsonWebTokenError) {
			  console.error("/auth: JWT Error:", error.message); // Log JWT error
			  return res.status(403).json({ message: "Please login again" });
			}
			console.error("Unexpected Error:", error);
			return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    try{
        helper()
    }
    catch(error){
        console.error(`Unexpected error failed to authenticate user`)
        return res.status(500).json({ error: 'Internal server error' }); 
    }
})

app.post("/check-cookies", (req, res) => {
    console.log("Parsed Cookies:", req.cookies);
    res.json({ message: "Cookies checked", cookies: req.cookies });
});

app.post('/logout', (req, res) => {
    console.log('logging out an user:',req.cookies?.refreshToken)
    res.clearCookie('refreshToken');
    res.sendStatus(200);
})

/*app.get('/chatconnection',(req,res)=>{
 http header for websocket
GET /chat HTTP/1.1
Host: example.com:8000
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
})

app.get('/canvasupdate',(req,res) => {
})
*/

const uWSapp = uWS./*SSL*/App({}).ws('/*', {
  /* Options */
  compression: uWS.SHARED_COMPRESSOR,
  maxPayloadLength: 16 * 1024 * 1024,
  idleTimeout: 10,
  maxBackpressure: 1024,

  /* Todo, Setting 1: merge messages in one, or keep them as separate WebSocket frames - mergePublishedMessages */
  /* Todo, Setting 4: send to all including us, or not? That's not a setting really just use ws.publish or global uWS.publish */

  /* Handlers */
  open: (ws) => {
    /* Let this client listen to all sensor topics */
    ws.subscribe('home/sensors/#');
  },
  message: (ws, message, isBinary) => {
    /* Parse this message according to some application
     * protocol such as JSON [action, topic, message] */

    /* Let's pretend this was a temperature message
     * [pub, home/sensors/temperature, message] */
    ws.publish('home/sensors/temperature', message);

    /* Let's also pretend this was a light message
     * [pub, home/sensors/light, message] */
    ws.publish('home/sensors/light', message);

    /* If you have good imagination you can also
     * pretend some message was a subscription
     * like so: [sub, /home/sensors/humidity].
     * I hope you get how any application protocol
     * can be implemented with these helpers. */
  },
  drain: (ws) => {

  },
  close: (ws, code, message) => {
    /* The library guarantees proper unsubscription at close */
  }
}).any('/*', (res, req) => {
  res.end('Nothing to see here!');
}).listen(port+2, (token) => {
  if (token) {
    console.log('Listening to port ' + port);
  } else {
    console.log('Failed to listen to port ' + port);
  }
});

const uwsApp = uWS.App({})
    .get('/*', (res, req) => {
      res.end('Welcome to the WebSocket Chat Server!');
    })
    .ws('/chat', {
        /* WebSocket behavior */
        open: (ws) => {
          // Initialize user's connection
          ws.subscribedRoom = null; // Keep track of the room the client is in
          console.log('A client connected.');
        },
        message: (ws, message, isBinary) => {
          const msg = Buffer.from(message).toString(); // Decode the message
          const parsedMsg = JSON.parse(msg); // Assuming the message is JSON formatted
          if (parsedMsg.type === 'subscribe') {
            // Handle subscription to a chat room
            const roomName = parsedMsg.room;
            if (!chatRooms.has(roomName)) {
              chatRooms.set(roomName, new Set());
            }
            // Unsubscribe from the previous room if applicable
            if (ws.subscribedRoom) {
              chatRooms.get(ws.subscribedRoom).delete(ws);
            }
            // Add user to the new room
            chatRooms.get(roomName).add(ws);
            ws.subscribedRoom = roomName;
            ws.send(JSON.stringify({ type: 'subscribed', room: roomName }));
            console.log(`Client subscribed to room: ${roomName}`);
          } else if (parsedMsg.type === 'message') {
            // Broadcast message to the chat room
            const roomName = ws.subscribedRoom;
            if (roomName && chatRooms.has(roomName)) {
              const clients = chatRooms.get(roomName);
              for (const client of clients) {
                if (client !== ws) {
                  client.send(JSON.stringify({ type: 'message', room: roomName, message: parsedMsg.message }));
                }
              }
            }
          }
        },
        close: (ws) => {
          // Handle client disconnection
          if (ws.subscribedRoom && chatRooms.has(ws.subscribedRoom)) {
            chatRooms.get(ws.subscribedRoom).delete(ws);
          }
          console.log('A client disconnected.');
        }
      })
    .listen(port+1, (token) => {
      if (token) {
        console.log('websocket listening to port ' + (port+1));
      } else {
        console.log('websocket Failed to listen to port ' + (port+1));
      }
    });

app.listen(port)
