import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mysql from 'mysql2/promise'; 
import winston from 'winston';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import http from 'http';
import { Console } from 'console';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 8300;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: '/mobile.dev/api/namada_faucet_logs.txt' }),
  ],
});

const db = mysql.createPool({ 
  host: "localhost",
  user: "newlogin",
  password: "newpar666",
  database: "faucet",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(cors({
  origin: 'https://namada.faucet.stake-take.com', 
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key'], 
  credentials: true, 
}));

app.use(bodyParser.json());
app.use(morgan('combined', {
  stream: {
    write: message => logger.info(message.trim())
  }
}));


const authenticate = (req, res, next) => {

  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === "35d9abcb-a040-4167-bf12-ffe18756d477") {
    logger.info(`Authenticated request with API key: ${apiKey} ****  ${new Date().toISOString()}`);
    
    next();
  } else {
    res.status(403).json({ message: 'It is not problems! Wait, please!' });

  }
}; 
app.post('/send_address', authenticate, async (req, res) => {
  const { address } = req.body;
  const currentTime = new Date();
  logger.info(`Received /send_address request with body: ${JSON.stringify(req.body)}******** ${new Date().toISOString()}***`);

  try {
    const [rows] = await db.query('SELECT time FROM faucetNama WHERE address = ? AND status = "blocked" ORDER BY time DESC LIMIT 1', [address]);

    if (rows.length > 0) {
      const lastTimeBlocked = new Date(rows[0].time);
      const diffHours = (currentTime - lastTimeBlocked) / 36e5;

      if (diffHours < 24) {
        const hoursLeft = 24 - diffHours;
        const fullHoursLeft = Math.floor(hoursLeft);
        const minutesLeft = Math.floor((hoursLeft % 1) * 60);
        const message = `Transaction blocked. Please wait ${fullHoursLeft} hour(s) and ${minutesLeft} minute(s).`;
        return res.status(444).json({ message });
      }
    }
    console.log(address);

    const externalApiResponse = await axios.post('http://current.stake-take.com:8002', { address });

    logger.info(`Response sent to ${externalApiResponse.data.status }:  successfully received at ${new Date().toISOString()}`);
    
    logger.info(`Ответ от сервера ${JSON.stringify(externalApiResponse.data)}: Время ${new Date().toISOString()}`);

    if (externalApiResponse.data.status === 'success') {
      const status = 'blocked';
      await db.query('INSERT INTO faucetNama (address,ipAddress, time, status) VALUES (?,?, ?, ?)', [address,'', currentTime, status]);

      console.log(`Address sent to external API: ${address}, response: ${externalApiResponse.data}`);

      res.status(200).json({ message: 'Tokens successfully received!', address, time: currentTime, status, externalApiResponse: externalApiResponse.data });
      logger.info(`Response sent to ${address}: Tokens successfully received at ${new Date().toISOString()}`);
    
      logger.info(`Response sent to ${externalApiResponse.data.status }: Tokens successfully received at ${new Date().toISOString()}`);
    
    } else {
     
      const errorMessage = 'Failed to receive tokens from the external server.';
      logger.error(errorMessage);
      res.status(500).json({ message: `Please wait or try again. ☺️` });
    }
  } catch (error) {
    logger.error(`Please wait or try again. ☺️`);

    logger.error(`Error during /send_address request processing: ${error.message} *** ${new Date().toISOString()} ****`);
    res.status(500).json({ message: `Please wait or try again. ` });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});

app.get('/namada_faucet_logs', (req, res) => {
  logger.info('Log file requested');
  res.sendFile(path.join(__dirname, '/mobile.dev/api/namada_faucet_logs.txt'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  logger.info(`Server started on port ${port} **** ${new Date().toISOString()} ***`);
});
