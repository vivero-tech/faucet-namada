import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path'
import cors from 'cors';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3010;
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));
app.use(bodyParser.json());


const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === "35d9abcb-a040-4167-bf12-ffe18756d477") {
    logger.info(`Authenticated request with API key: ${apiKey} ****  ${new Date().toISOString()}`);
    next();
  } else {
    res.status(403).json({ message: 'It is not problems! Wait, please!' });
  }
};



app.post('/log', (req, res) => {
  const { ipAddress } = req.body;
  const logMessage = `IP: ${ipAddress}\n`;
  const logFilePath = path.join(__dirname, 'logs1.txt');

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
      return res.status(500).send('Error writing to log file');
    }
    console.log('Log updated with:', logMessage);
    res.json({ message: 'Log updated' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
