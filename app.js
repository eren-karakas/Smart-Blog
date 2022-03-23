const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');
const fs = require('fs');
const Photo = require('./models/Photo');

const server = '127.0.0.1';
const port = '3000';

// CONNECT DB
app.listen(port, server, async () => {
  await mongoose.connect('mongodb://localhost/sb-test-db');
  console.log(`Server is active ! http://${server}:${port}/`);
});

// TEMPLATE ENGINE
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

// ROUTES
app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated');
  res.render('index', {
    photos,
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', async (req, res) => {
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,  
    });
    res.redirect('/');
  });
});

app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
});
