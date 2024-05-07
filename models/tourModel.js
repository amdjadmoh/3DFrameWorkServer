const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
  information: { type: String },
  x: {
    type: Number,
    required: [true, ' must have a x  coordinate'],
  },
  y: {
    type: Number,
    required: [true, ' must have a y  coordinate'],
  },
  z: {
    type: Number,
    required: [true, ' must have a z  coordinate'],
  },
});
const pointerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  nextScene: {
    type: mongoose.Schema.Types.ObjectId,
  },
  x: {
    type: Number,
    required: [true, ' must have a x  coordinate'],
  },
  y: {
    type: Number,
    required: [true, ' must have a y  coordinate'],
  },
  z: {
    type: Number,
    required: [true, ' must have a z  coordinate'],
  },
});

const sceneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A scene must have a name'],
  },
  description: {
    type: String,
  },
  imageLink: {
    type: String,
    required: [true, 'A scene must have an image'],
  },
  scenePointer: [pointerSchema],
  infoList: [infoSchema],
});
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: [true, 'tour already exists'],
  },
  description: {
    type: String,
  },
  tourImage: {
    type: String,
  },
  scenesList: [sceneSchema],
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
