const express = require('express');
const { getTodos, getTodo, createTodo, updateTodo, deleteTodo } = require('../controllers/todoController');
const { check } = require('express-validator');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTodos)
  .post(
    [
      check('title', 'Title is required').not().isEmpty()
    ],
    createTodo
  );

router.route('/:id')
  .get(getTodo)
  .put(
    [
      check('title', 'Title is required').not().isEmpty()
    ],
    updateTodo
  )
  .delete(deleteTodo);

module.exports = router;