import express from 'express';
import uWS from 'uWebSockets.js';
import bodyParser from 'body-parser'
import {checkUserExists, createUser, updateGoogleUser} from './db/user_actions.js'
import axios  from 'axios';
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'coLab'
});
console.log('created a connection pool for mysql')

import cors from 'cors';
const port = 3000
const app = express()
app.use(cors())
app.use(bodyParser.json());

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
    console.log('responsing to client request')
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

app.post('/userlogin', async function(req, res){
    try {
        const accessToken = req.body?.access_token;
        if (!accessToken) {
          return res.status(400).json({ error: 'Access token is required' }); 
        }
        const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,{
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json'
            }
        })
        const userExist = await checkUserExists({google_id: response.data.id, connection_pool:pool})
        if(!userExist){
            const userCreateResponse = await createUser({profile_pic:response.data.picture, google_id:response.data.id, userName:response.data.name, createAt:new Date().toLocaleString(), email:response.data.email, verified_email:response.data.verified_email, picture:response.data.picture, connection_pool:pool})
            console.log(`user creation response ${userCreateResponse}`)
            res.status(200).json({ newUser:true , name: response.data.name, picture: response.data.picture});
            return
        }else{
            await updateGoogleUser({profile_pic:response.data.picture, google_id:response.data.id, userName:response.data.name, createAt:new Date().toLocaleString(), email:response.data.email, verified_email:response.data.verified_email, picture:response.data.picture, connection_pool:pool})
        }
        res.status(200).json({ newUser:false , name: response.data.name, picture: response.data.picture});
        return
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: 'Internal server error' }); // Send a 500 Internal Server Error
    }
})

app.get('/chatconnection',(req,res)=>{
/* http header for websocket
GET /chat HTTP/1.1
Host: example.com:8000
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
*/
})

app.get('/canvasupdate',(req,res) => {
})

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
