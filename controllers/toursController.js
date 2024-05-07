const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAlltours = catchAsync(async (req, res, next) => {
  const Tours = await Tour.find();
  if (!Tours) {
    return next(new AppError('No tours found', 404));
  }
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    ToursNo: Tours.length,
    data: {
      Tours: Tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const tourData = {
    name: req.body.name,
    description: req.body.description,
  };

  if (req.file) {
    tourData.tourImage = req.file.path.substring(7);
  }

  const newTour = await Tour.create(tourData);
  res.status(201).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      tourImage: req.body.tourImage,
      scenesList: req.body.scenesList,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour: tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  //Delete image file
  fs.unlink(`public/${tour.tourImage}`);
  tour.scenesList.forEach((scene) => {
    fs.unlink(`public/${scene.imageLink}`);
  });
  await Tour.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    message: ' deleted!',
  });
});

exports.addScene = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  const requestData = req.body;
  const scene = {
    _id: new mongoose.Types.ObjectId(),
    name: requestData.name,
    description: requestData.description,
    imageLink: req.file.path.substring(7),
  };
  tour.scenesList.push(scene);
  await tour.save();
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      scene: scene,
    },
  });
});

exports.addPointer = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourID);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  const scene = tour.scenesList.id(req.params.sceneID);
  if (!scene) {
    return next(new AppError('No tour found with that ID', 404));
  }
  // Add the new pointer to the scene's scenePointer array
  scene.scenePointer.push(req.body);
  // Save the updated tour
  await tour.save();
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.addInfo = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourID);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  const scene = tour.scenesList.id(req.params.sceneID);
  if (!scene) {
    return next(new AppError('No tour found with that ID', 404));
  }
  // Add the new info to the scene's info array
  scene.infoList.push(req.body);
  // Save the updated tour
  await tour.save();
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

// exports.getAllscenes = async (req, res) => {
//   try {
//     const Scenes = await Scene.find();
//     res.status(200).json({
//       status: 'success',
//       requestedAt: req.requestTime,
//       ScenesNo: Scenes.length,
//       data: {
//         Scenes: Scenes,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };
// exports.getScene = async (req, res) => {
//   try {
//     const scene = await Scene.findById(req.params.id);
//     // or event.findOne({_id:req.params.id});
//     res.status(200).json({
//       status: 'success',
//       requestedAt: req.requestTime,
//       data: {
//         Scene: scene,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: 'not found',
//     });
//   }
// };
// exports.createScene = async (req, res) => {
//   try {
//     const newScene = await Scene.create({
//       name: req.body.name,
//       imageLink: req.file.path.substring(7),
//     });
//     res.status(201).json({
//       status: 'success',
//       requestedAt: req.requestTime,
//       data: {
//         scene: newScene,
//       },
//     });
//   } catch (err) {
//     console.log(err.message);
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

// exports.updateScene = async (req, res) => {
//   try {
//     const scene = await Scene.findByIdAndUpdate(
//       req.params.id,
//       {
//         name: req.body.name,
//         imageLink: req.body.imageLink,
//         scenePointer: req.body.scenePointer,
//       },
//       {
//         new: true,
//         runValidators: true,
//       },
//     );
//     res.status(200).json({
//       status: 'success',
//       requestedAt: req.requestTime,
//       data: {
//         scene: scene,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };
// exports.deleteScene = async (req, res) => {
//   try {
//     const scene = await Scene.findById(req.params.id);
//     if (!scene) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'No scene found with that ID',
//       });
//     }
//     //Delete image file
//     fs.unlink(`public/${scene.imageLink}`, (err) => {
//       if (err) {
//         return res.status(500).json({
//           status: 'fail',
//           message: 'Error deleting image file',
//         });
//       }
//     });
//     await Scene.findByIdAndDelete(req.params.id);
//     res.status(200).json({
//       status: 'success',
//       requestedAt: req.requestTime,
//       message: ' deleted!',
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: 'file not found',
//     });
//   }
// };
