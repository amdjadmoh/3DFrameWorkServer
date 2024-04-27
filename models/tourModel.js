const mongoose = require('mongoose');

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
  scenesList: [mongoose.Schema.Types.ObjectId],
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
