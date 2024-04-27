const express = require('express');
const multer = require('multer');
const path = require('path');

const scenesController = require('../controllers/scenesController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const router = express.Router();
router
  .route('/:id/addPointer')
  .get((req, res) => {
    res.render('scene');
  })
  .post(upload.single('image'), scenesController.addLink);
router
  .route('/')
  .get(scenesController.getAllscenes)
  .post(upload.single('image'), scenesController.createScene);
router
  .route('/:id')
  .get(scenesController.getScene)
  .patch(scenesController.updateScene)
  .delete(scenesController.deleteScene);

module.exports = router;
