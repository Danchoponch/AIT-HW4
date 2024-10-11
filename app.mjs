// app.mjs
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the Express application
const app = express();

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the port to 3000
const PORT = 3000;

// Start the server and log a message
const server = app.listen(PORT, () => {
  console.log(`Server started; type CTRL+C to shut down`);
});

// Export server for testing purposes
export {app, server};

