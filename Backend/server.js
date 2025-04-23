import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import * as dotenv from 'dotenv'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFiles = [
  path.join(__dirname, '.env'),           // Standard .env file (main)
  path.join(__dirname, '.env.local'),     // Local development fallback
  path.join(__dirname, '.env.production') // Production fallback
];

let envLoaded = false;
for (const envPath of envFiles) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  dotenv.config();
  console.log('No specific .env file found, using default environment');
}

const TEMP_DIR = path.join(__dirname, 'temp');

const CLEANUP_INTERVAL_MS = 20 * 1000;
const MAX_FILE_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

function cleanupTempFiles() {
  fs.readdir(TEMP_DIR, (err, files) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return;
      }
      console.error('Error reading temp directory:', err);
      return;
    }

    const now = Date.now();

    files.forEach(file => {
      const filePath = path.join(TEMP_DIR, file);
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) {
          console.error(`Error getting stats for file ${file}:`, statErr);
          return;
        }

        const fileAge = now - (stats.birthtimeMs || stats.mtimeMs);

        if (fileAge > MAX_FILE_AGE_MS) {
          console.log(`Deleting old temp file: ${file} (Age: ${Math.round(fileAge / 1000)}s)`);
          fs.unlink(filePath, unlinkErr => {
            if (unlinkErr) {
              console.error(`Error deleting file ${file}:`, unlinkErr);
            }
          });
        }
      });
    });
  });
}

if (!fs.existsSync(TEMP_DIR)) {
  try {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
    console.log(`Created temp directory: ${TEMP_DIR}`);
  } catch (mkdirErr) {
    console.error(`Failed to create temp directory ${TEMP_DIR}:`, mkdirErr);
  }
}

setInterval(cleanupTempFiles, CLEANUP_INTERVAL_MS);

const app = new Hono()

app.use('*', cors())

import createCheckoutSession from './routes/create-checkout-session.js'

app.route('/api', createCheckoutSession)

app.get('/', (c) => c.text("Hello World!"))

const port = process.env.PORT || 3001
const server = serve({ fetch: app.fetch, port })

console.log(`Server running at http://localhost:${port}`)