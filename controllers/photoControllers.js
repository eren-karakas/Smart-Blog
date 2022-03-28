const Photo = require('../models/Photo');
const fs = require('fs');

const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated');
  res.render('index', {
    photos,
  });
};

const createPhoto = async (req, res) => {
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
};

const getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
};

const getEditPage = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', {
    photo,
  });
};

const updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

const deletePhoto = async (req, res) => {
  const photo = await Photo.findById({ _id: req.params.id });

  let deletedImage = __dirname + '/../public' + photo.image;

  if ((await Photo.find({ image: photo.image })).length < 2) {
    fs.unlinkSync(deletedImage);
  }

  await Photo.findByIdAndRemove(req.params.id);

  res.redirect('/');
};

module.exports = {
  getAllPhotos,
  createPhoto,
  getPhoto,
  getEditPage,
  updatePhoto,
  deletePhoto,
};
