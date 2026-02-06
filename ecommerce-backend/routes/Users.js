// const express = require('express');
// const { fetchUserById, updateUser } = require('../controller/User');

// const router = express.Router();
// //  /users is already added in base path
// router.get('/own', fetchUserById)
//       .patch('/:id', updateUser)

// exports.router = router;


const express = require('express');
const { 
  fetchUserById, 
  updateUser,
  fetchAllUsers,
  updateUserRole,
  getUserStats,
  deleteUser,
  getUserPermissions
} = require('../controller/User');

const router = express.Router();

// ===== USER ROUTES =====
// /users is already added in base path

// Get current logged-in user
router.get('/own', fetchUserById);

// Update user profile
router.patch('/:id', updateUser);

// ===== ADMIN ROUTES =====
// These require admin or superadmin role (add auth middleware)

// Get all users (with pagination, filtering, sorting)
router.get('/', fetchAllUsers);

// Get user statistics
router.get('/stats', getUserStats);

// Get current user's permissions
router.get('/permissions', getUserPermissions);

// Update user role
router.patch('/:id/role', updateUserRole);

// Delete user (superadmin only)
router.delete('/:id', deleteUser);

exports.router = router;