const express = require('express');
const toursController = require('../controllers/toursController');
const { uploadTourImage, uploadSceneImage } = require('../utils/uploadingFile');
const authController = require('../controllers/authController');

const router = express.Router();
router
  .route('/:id/addScene')
  .get((req, res) => {
    res.render('scene');
  })
  .post(uploadSceneImage.single('image'), toursController.addScene);
router
  .route('/')
  .get(toursController.getAlltours)
  .post(
    authController.protect,
    uploadTourImage.single('image'),
    toursController.createTour,
  );
router
  .route('/:id')
  .get(toursController.getTour)
  .patch(toursController.updateTour)
  .delete(toursController.deleteTour);
router.route('/:tourID/:sceneID').post(toursController.addPointer);
module.exports = router;
