const mongoose = require('mongoose');

const InfoSchema = new mongoose.Schema({
  url: { type: String },
  px: {
    type: Number,
  },
  py: {
    type: Number,
  },
  pz: {
    type: Number,
  },
  prx: {
    type: Number,
    default: 0,
  },
  pry: {
    type: Number,
    default: 0,
  },
  prz: {
    type: Number,
    default: 0,
  },
});
const TextBoxSchema = new mongoose.Schema({
  value: { type: String },
  height: { type: String, default: '45' },
  width: {
    type: String,
    default: '155',
  },
  px: {
    type: Number,
  },
  py: {
    type: Number,
  },
  pz: {
    type: Number,
  },
  prx: {
    type: Number,
    default: 0,
  },
  pry: {
    type: Number,
    default: 0,
  },
  prz: {
    type: Number,
    default: 0,
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
  s: {
    type: Number,
    default: 15,
  },
  rx: {
    type: Number,
    default: 0,
  },
  ry: {
    type: Number,
    default: 0,
  },
  rz: {
    type: Number,
    default: 0,
  },
});

const sceneSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  imageLink: {
    type: String,
    required: [true, 'A scene must have an image'],
  },
  scenePointer: [pointerSchema],
  TextBoxList: [TextBoxSchema],
  information: [InfoSchema],
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
  isPublic: {
    type: Boolean,
    default: false,
  },
  tourCreator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
