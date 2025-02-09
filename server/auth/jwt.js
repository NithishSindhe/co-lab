import jwt from 'jsonwebtoken'
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const privateKeyPath = path.join(__dirname, 'private.key');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const publicKeyPath = path.join(__dirname, 'public.key');
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
import { config } from 'dotenv';
config({ path: `${__dirname}/../.env` });
const refresh_key = process.env.REFRESH_SECRET;

export async function sign_refresh_token({data,validity_duration='7d'}){
    //data should be object
    const refreshtoken = jwt.sign(data, refresh_key, { algorithm: 'HS256', expiresIn: validity_duration });
    return refreshtoken
}

export async function verify_refresh_token({token}) {
    const decoded = jwt.verify(token, refresh_key, { algorithms: ["HS256"] });
    return decoded;  // Decoded payload
}

export async function sign_token({data,validity_duration='15m'}) {
    const token = jwt.sign(data, privateKey, { algorithm: 'RS256', expiresIn: validity_duration });
    return token
}

export async function verify_token({token}){
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    return decoded
}

export async function refresh_token({refreshToken}){
    if(!refreshToken) throw new Error('refreshToken is required ') 
    try{
        const decoded = await verify_token({token:refreshToken})
        // new access code
        return sign_token({email:decoded?.email,user_name:decoded?.user_name})
    }
    catch(error){
        console.error('unable to refresh token: ',error)
    }
}



