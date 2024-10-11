// app.mjs
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//init express
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const method = req.method;  
  const path = req.path;      
  const query = req.query;    


  console.log(`Method: ${method}`);
  console.log(`Path: ${path}`);
  console.log('Query:', query);


  next();
});


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'public', 'views'));
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

const PORT = 3000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server started; type CTRL+C to shut down`);
});

export {app, server};

