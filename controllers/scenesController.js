const mongoose = require('mongoose');
const Tour = require('../models/tourModel');
const Scene = require('../models/sceneModel');

exports.getAlltours = async (req, res) => {
  try {
    const Tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      ToursNo: Tours.length,
      data: {
        Tours: Tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.getAllscenes = async (req, res) => {
  try {
    const Scenes = await Scene.find();
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      ScenesNo: Scenes.length,
      data: {
        Scenes: Scenes,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.getScene = async (req, res) => {
  try {
    const scene = await Scene.findById(req.params.id);
    // or event.findOne({_id:req.params.id});
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        Scene: scene,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'not found',
    });
  }
};
exports.createScene = async (req, res) => {
  try {
    const newScene = await Scene.create({
      name: req.body.name,
      imageLink: req.file.path.substring(7),
    });
    res.status(201).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        scene: newScene,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateScene = async (req, res) => {
  try {
    const scene = await Scene.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        imageLink: req.body.imageLink,
        scenePointer: req.body.scenePointer,
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
        scene: scene,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.deleteScene = async (req, res) => {
  try {
    await Scene.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      message: ' deleted!',
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'file not found',
    });
  }
};
exports.addLink = async (req, res) => {
  try {
    const scene = await Scene.findById(req.params.id);
    if (!scene) {
      return res.status(404).json({
        status: 'fail',
        message: 'Scene not found',
      });
    }

    // const subScene = await Scene.create({
    //   name: req.body.name,
    //   imageLink: req.file.path.subString(7),
    // });
    const requestData = req.body;
    const subdocument = {
      _id: new mongoose.Types.ObjectId(),
      nextScene: requestData.nextScene,
      name: requestData.name,
      x: requestData.x,
      y: requestData.y,
      z: requestData.z,
    };

    scene.scenePointer.push(subdocument);
    await scene.save();
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        scene: scene,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'not found',
    });
  }
};
