// app.mjs
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//init express
const app = express();


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'public', 'views'));
// console.log('Views folder:', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect('/editor'); // Redirects to the editor page
  });
  
app.get('/editor', (req, res) => {
  res.render('editor'); // Renders editor.hbs template
});

app.get('/phonebook', (req, res) => {
  res.render('phonebook'); // Renders phonebook.hbs template
});

// Set the port to 3000
const PORT = 3000;

// Start the server and log a message
const server = app.listen(PORT, () => {
  console.log(`Server started; type CTRL+C to shut down`);
});

// Export server for testing purposes
export {app, server};

