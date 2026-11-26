const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

async function signUp(req, res) {
  try {
    const { username, password, firstName, lastName, role, profileImage } =
      req.body;

    // Validation
    if (!username || !password || !firstName || !lastName)
      return res.status(400).json({
        message: "Username, password, first and last name are required.",
      });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be more than 6 characters" });

    const user = await User.create({
      username,
      hashedPassword: await bcrypt.hash(password, 12),
      firstName,
      lastName,
      role,
      profileImage,
    });

    const { _id, createdAt, updatedAt } = user;

    res.status(201).json({
      username: user.username,
      _id,
      firstName,
      lastName,
      role,
      createdAt,
      updatedAt,
    });
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: err.message,
      });
    }
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function signIn(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required.",
      });
    }
    const user = await User.findOne({
      username: username.toLowerCase().trim(),
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword,
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Construct the payload
    const payload = {
      username: user.username,
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    return res.status(200).json({
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function verifyUser(req, res) {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

const updateOneUser = async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.userId);

    if (!foundUser) return res.status(404).json({ message: "User not found" });

    if (!foundUser._id.equals(req.user._id))
      return res
        .status(409)
        .json({ message: "You are not authorize to update this user" });

    const { username, firstName, lastName, profileImage } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      foundUser._id,
      {
        username: username,
        firstName: firstName,
        lastName: lastName,
        profileImage: profileImage,
      },
      { returnDocument: "after", runValidators: true },
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: err.message,
      });
    }
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const changeUserRole = async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.userId);

    if (!foundUser) return res.status(404).json({ message: "User not found" });

    if (req.user.role !== "admin")
      return res
        .status(409)
        .json({ message: "You are not authorize to update this user" });

    const updatedUser = await User.findByIdAndUpdate(
      foundUser._id,
      {
        role: req.body.role,
      },
      { returnDocument: "after", runValidators: true },
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: err.message,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  signUp,
  signIn,
  verifyUser,
  updateOneUser,
  changeUserRole,
};
