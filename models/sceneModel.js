const mongoose = require('mongoose');

const pointerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  nextScene: {
    type: mongoose.Schema.Types.ObjectId,
  },
  x: {
    type: Number,
    required: [true, 'A pointer must have a x  coordinate'],
  },
  y: {
    type: Number,
    required: [true, 'A pointer must have a y  coordinate'],
  },
  z: {
    type: Number,
    required: [true, 'A pointer must have a z  coordinate'],
  },
  s: {
    type: Number,
  },
});

const sceneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A scene must have a name'],
    unique: [true, 'scene already exists'],
  },
  description: {
    type: String,
  },
  imageLink: {
    type: String,
    required: [true, 'A scene must have an image'],
  },
  previewImage: {
    type: String,
  },
  scenePointer: [pointerSchema],
});
const Scene = mongoose.model('Scene', sceneSchema);
module.exports = Scene;
