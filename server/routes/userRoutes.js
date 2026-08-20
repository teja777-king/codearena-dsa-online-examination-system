const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.use(protect);

router.route('/')
  .get(requireAdmin, getUsers);

router.route('/:id')
  .get(getUserById)
  .put(requireAdmin, updateUser)
  .delete(requireAdmin, deleteUser);

router.put('/:id/toggle-status', requireAdmin, toggleUserStatus);

module.exports = router;
