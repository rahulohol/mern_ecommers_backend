// const { Category } = require("../model/Category");
// const { User } = require("../model/User");

// exports.fetchUserById = async (req, res) => {
//   const id = req.userId;
//   console.log(id);
//   try {
//     const user = await User.findById(id);
//     console.log(user);
//     res.status(200).json({
//       id: user.id,
//       addresses: user.addresses,
//       email: user.email,
//       role: user.role,
//       imgpath: user.imgpath,
//       firstName: user.firstName,
//       lastName: user.lastName,
//     });
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

// exports.updateUser = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await User.findByIdAndUpdate(id, req.body, { new: true });
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };



const { User } = require("../model/User");

// ===== EXISTING FUNCTIONS =====

exports.fetchUserById = async (req, res) => {
  const id = req.userId;
  console.log(id);
  try {
    const user = await User.findById(id);
    console.log(user);
    res.status(200).json({
      id: user.id,
      addresses: user.addresses,
      email: user.email,
      role: user.role,
      imgpath: user.imgpath,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

// ===== NEW ADMIN USER MANAGEMENT FUNCTIONS =====

/**
 * Fetch all users with pagination, filtering, and sorting
 * Admin and SuperAdmin only
 */
exports.fetchAllUsers = async (req, res) => {
  try {
    const limit = Number(req.query._limit || 10);
    const page = Number(req.query._page || 1);
    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    
    // Filter by role
    if (req.query.role) {
      query.role = { $in: req.query.role.split(',') };
    }
    
    // Search by email or name
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { email: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex }
      ];
    }
    
    // Sorting
    let sortOptions = {};
    if (req.query._sort && req.query._order) {
      sortOptions[req.query._sort] = req.query._order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Default: newest first
    }
    
    // Fetch users (exclude password)
    const users = await User.find(query)
      .select('-password -resetPasswordToken')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);
    
    res.status(200).json({
      users,
      totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit),
    });
    
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(400).json({ 
      error: 'Failed to fetch users',
      message: err.message 
    });
  }
};

/**
 * Update user role
 * Requires permission check based on requester's role
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Get the user making the request
    const requesterId = req.userId;
    const requester = await User.findById(requesterId);
    
    if (!requester) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get the user being updated
    const targetUser = await User.findById(id);
    
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Validate the new role
    const validRoles = ['user', 'admin', 'superadmin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    // ===== PERMISSION CHECKS =====
    
    // Prevent users from changing roles
    if (requester.role === 'user') {
      return res.status(403).json({ 
        error: 'Forbidden: Users cannot change roles' 
      });
    }
    
    // Admin can only change user and admin roles
    if (requester.role === 'admin') {
      // Admin cannot modify superadmin
      if (targetUser.role === 'superadmin') {
        return res.status(403).json({ 
          error: 'Forbidden: Admins cannot modify superadmins' 
        });
      }
      
      // Admin cannot promote anyone to superadmin
      if (role === 'superadmin') {
        return res.status(403).json({ 
          error: 'Forbidden: Admins cannot create superadmins' 
        });
      }
    }
    
    // SuperAdmin can change any role
    // (no restrictions)
    
    // Prevent users from changing their own role
    if (requesterId === id) {
      return res.status(403).json({ 
        error: 'Forbidden: Cannot change your own role' 
      });
    }
    
    // Update the role
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password -resetPasswordToken');
    
    res.status(200).json({
      message: 'User role updated successfully',
      user: updatedUser
    });
    
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(400).json({ 
      error: 'Failed to update user role',
      message: err.message 
    });
  }
};

/**
 * Get user statistics for dashboard
 */
exports.getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalUsers = await User.countDocuments();
    
    // Format stats
    const formattedStats = {
      total: totalUsers,
      byRole: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    };
    
    res.status(200).json(formattedStats);
    
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(400).json({ 
      error: 'Failed to fetch user statistics',
      message: err.message 
    });
  }
};

/**
 * Delete user (soft delete - optional implementation)
 * SuperAdmin only
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requesterId = req.userId;
    
    // Prevent deleting yourself
    if (requesterId === id) {
      return res.status(403).json({ 
        error: 'Forbidden: Cannot delete your own account' 
      });
    }
    
    // Get requester
    const requester = await User.findById(requesterId);
    
    // Only superadmin can delete users
    if (requester.role !== 'superadmin') {
      return res.status(403).json({ 
        error: 'Forbidden: Only superadmins can delete users' 
      });
    }
    
    // Delete the user
    await User.findByIdAndDelete(id);
    
    res.status(200).json({
      message: 'User deleted successfully',
      deletedUserId: id
    });
    
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(400).json({ 
      error: 'Failed to delete user',
      message: err.message 
    });
  }
};

/**
 * Get current user's permissions
 */
exports.getUserPermissions = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select('role');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const permissions = {
      role: user.role,
      canManageUsers: ['admin', 'superadmin'].includes(user.role),
      canManageProducts: ['admin', 'superadmin'].includes(user.role),
      canManageOrders: ['admin', 'superadmin'].includes(user.role),
      canCreateSuperadmin: user.role === 'superadmin',
      canDeleteUsers: user.role === 'superadmin',
      canModifySuperadmin: user.role === 'superadmin',
    };
    
    res.status(200).json(permissions);
    
  } catch (err) {
    console.error('Error fetching permissions:', err);
    res.status(400).json({ 
      error: 'Failed to fetch permissions',
      message: err.message 
    });
  }
};