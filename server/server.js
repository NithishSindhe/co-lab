import express from 'express';
import bodyParser from 'body-parser'
import {checkUserExists, createUser, updateGoogleUser} from './db/user_actions.js'
import axios  from 'axios';

import cors from 'cors';
const port = 3000
const app = express()
app.use(cors())
app.use(bodyParser.json());

app.get('/bitArray', function (req, res) {
    const bitArray = new Array(1000).fill('#000000'); 
    res.send(bitArray)
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
        const userExist = await checkUserExists({google_id: response.data.id})
        if(!userExist){
            const userCreateResponse = await createUser({profile_pic:response.data.picture, google_id:response.data.id, userName:response.data.name, createAt:new Date().toLocaleString(), email:response.data.email, verified_email:response.data.verified_email, picture:response.data.picture})
            console.log(`user creation response ${userCreateResponse}`)
            res.status(200).json({ newUser:true , name: response.data.name, picture: response.data.picture});
        }else{
            await updateGoogleUser({profile_pic:response.data.picture, google_id:response.data.id, userName:response.data.name, createAt:new Date().toLocaleString(), email:response.data.email, verified_email:response.data.verified_email, picture:response.data.picture})
        }
        res.status(200).json({ newUser:false , name: response.data.name, picture: response.data.picture});
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: 'Internal server error' }); // Send a 500 Internal Server Error
    }
})



app.listen(port)
