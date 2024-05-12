const express = require('express');
const toursController = require('../controllers/toursController');
const { uploadTourImage, uploadSceneImage } = require('../utils/uploadingFile');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    toursController.getUserTours,
  )
  .post(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    uploadTourImage.single('image'),
    toursController.createTour,
  );
router
  .route('/:tourID')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    authController.restrictTourToCreator,
    toursController.getTour,
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    authController.restrictTourToCreator,
    toursController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    authController.restrictTourToCreator,
    toursController.deleteTour,
  )
  .post(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    authController.restrictTourToCreator,
    uploadSceneImage.single('image'),
    toursController.addScene,
  );
// router
//   .route('/:tourID/:sceneID')
//   .post(
//     authController.getTour,
//     authController.protect,
//     authController.restrictTo('admin', 'user'),
//     toursController.addPointer,
//   );
module.exports = router;
