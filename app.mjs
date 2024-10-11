// app.mjs
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Contact } from './contact.mjs';

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

let initContacts = [];

function loadContacts() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'code-samples', 'phonebook.json'), 'utf-8', (err, data) => {
            if (err) {
                reject('Error reading the file:', err);
            } else {
                try {

                    const contactData = JSON.parse(data);
                    initContacts = contactData.map(item => new Contact(item.name, item.email, item.phoneNumbers));
                    console.log(initContacts);

                    resolve(); 
                } catch (parseError) {
                    reject('Error parsing JSON:', parseError);
                }
            }
        });
    });
}

function decorate(contact) {
    const contactInfo = `Email: ${contact.email}\nPhone Numbers: ${contact.phoneNumbers.join(', ')}`;
    return `<span class="contact-info" title="${contactInfo}">${contact.name}</span>`;
}

function getModifiedText(originalText, contacts) {
  let modifiedText = originalText;
  
  contacts.forEach(contact => {
    modifiedText = modifiedText.split(contact.name).join(decorate(contact));
  });

  return modifiedText;
}

// Renders phonebook.hbs template
app.get('/phonebook', (req, res) => {
    const searchTerm = req.query.contact ? req.query.contact.toLowerCase() : '';

  
    const filteredContacts = initContacts.filter(contact => {
        const contactString = `${contact.name} ${contact.email} ${contact.phoneNumbers.join(' ')}`.toLowerCase();
        return contactString.includes(searchTerm);
    });

    res.render('phonebook', { initContacts: filteredContacts });
  });


app.post('/phonebook', (req, res) => {
    const { name, email, phoneNumbers } = req.body;

    const newContact = new Contact(name, email, phoneNumbers.split(',').map(num => num.trim()));

    initContacts.push(newContact);

    res.redirect(303, '/phonebook');
});

app.post('/editor', (req, res) => {
    const originalText = req.body.formText;
    
    if (!originalText) {
        return res.render('editor', { error: 'Please enter some text to modify.' });
    }
    
    
    const modifiedText = getModifiedText(originalText, initContacts);
  
    res.render('editor', { originalText, modifiedText });
  });

await loadContacts();
const PORT = 3000;
// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server started; type CTRL+C to shut down`);
});

export {app, server, decorate};

