// const bcrypt = require("bcrypt");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
require("dotenv").config();


const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getMovieRecommendation = async (req, res) => {
  const { message } = req.body;

  try {
    // Send the user's message to OpenAI's GPT-3.5 model
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You're a movie recommendation assistant." },
        { role: "user", content: message },
      ],
    });

    // Extract the response from OpenAI
    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching from OpenAI" });
  }
};



const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ message: "User already exists", success: false });
    }
    const userModel = { name, email, password };
    userModel.password = await bcrypt.hash(password, 10); //we overwrite the password variable with bcrypted password

    const newUser = new UserModel(userModel);
    await newUser.save();
    res.status(201).json({ message: "Signup Sucesss", success: true });
  } catch (err) {
    res.status(500).json({ message: "Error Occurred", success: false });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(403)
        .json({ message: "email or password incorrect", success: false });
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res
        .status(403)
        .json({ message: "password is incorrect", success: false });
    }
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res
      .status(200)
      .json({
        message: "Login Sucesss",
        success: true,
        jwtToken,
        email,
        name: user.name,
      });
  } catch (err) {
    res.status(500).json({ message: "Error Occurred", success: false });
  }
};


const updateGenre = async (req, res) => {
  try {
    const { genres } = req.body; // Assuming genres is an array of selected genres
    const { userId } = req.user; // Assuming userId is extracted from JWT token or session

    if (!genres || genres.length === 0) {
      return res
        .status(400)
        .json({ message: "No genres selected", success: false });
    }

    // Find the user and update their genres and genreSelected flag
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        genre: genres,
        genreSelected: true, // Mark as genre selected
      },
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res.status(200).json({
      message: "Genres updated successfully",
      success: true,
      user: updatedUser, // Return updated user data (optional)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error occurred", success: false });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.userId).select("-password");
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: "Error fetching user data", 
      success: false 
    });
  }
};


const resetGenreSelected = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { genreSelected: false },
      
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Genre preference reset", user });
  } catch (error) {
    console.error("Error resetting genreSelected:", error);
    return res.status(500).json({ message: "Server error" });
  }
};






module.exports = { signup, login, updateGenre , getUser, resetGenreSelected,getMovieRecommendation};
 