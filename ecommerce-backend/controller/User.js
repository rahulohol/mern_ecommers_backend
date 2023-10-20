const { Category } = require("../model/Category");
const { User } = require("../model/User");

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
