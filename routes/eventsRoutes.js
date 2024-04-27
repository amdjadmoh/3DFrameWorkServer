const express = require('express');
const eventsController = require('../controllers/eventsController');

const router = express.Router();
router
  .route('/')
  .get(eventsController.getAllevents)
  .post(eventsController.createEvent);
router
  .route('/:id')
  .get(eventsController.getEvent)
  .patch(eventsController.updateEvent)
  .delete(eventsController.deleteEvent);
module.exports = router;
