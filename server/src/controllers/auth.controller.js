import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const User = await User.findOne({ email });
    if (User) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "User creation failed" });
    }
  } catch (error) {
    console.log("Error in signup controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = (req, res) => {
  res.send("login route");
};

export const logout = (req, res) => {
  res.send("logout route");
};
