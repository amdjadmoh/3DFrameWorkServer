const multer = require('multer');
const path = require('path');

const TourStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/toursImages');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const SceneStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/360Images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadTourImage = multer({ storage: TourStorage });
const uploadSceneImage = multer({ storage: SceneStorage });
module.exports = { uploadTourImage, uploadSceneImage };
