const Event = require('../models/tourModel');

exports.getAllevents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      EventssNo: events.length,
      data: {
        events: events,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    // or event.findOne({_id:req.params.id});
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        event: event,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'not found',
    });
  }
};
exports.createEvent = async (req, res) => {
  try {
    console.log(req.files);
    const newEvent = await Event.create(req.body);
    res.status(201).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        event: newEvent,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        event: event,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'not found',
    });
  }
};
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
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
