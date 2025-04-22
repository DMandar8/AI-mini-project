const Joi = require("joi");
const jwt = require("jsonwebtoken");


const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(15).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: "Bad Request", error });
  }
  next();
};

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(4).max(15).required(),
    });
  
    const { error } = schema.validate(req.body);
  
    if (error) {
      return res.status(400).json({ message: "Bad Request", error });
    }
    next();
};


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded._id, email: decoded.email };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid Token", success: false });
  }
};


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user; // Store user data in request
    next();
  });
};




module.exports={signupValidation,loginValidation, verifyToken, authenticateToken};
