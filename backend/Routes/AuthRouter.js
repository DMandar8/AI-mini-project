const { login, signup, updateGenre, getUser,resetGenreSelected ,getMovieRecommendation} = require('../Controller/AuthController');
const { loginValidation, signupValidation, verifyToken, authenticateToken } = require('../Middlewares/AuthValidation');

const router=require('express').Router();

router.post('/login',loginValidation,login);

router.post('/signup',signupValidation,signup);

router.post('/update-genre',verifyToken,updateGenre);
router.get("/get-user", verifyToken, getUser);
router.post("/reset-genre", authenticateToken, resetGenreSelected);
router.post('/chatbot', getMovieRecommendation);



module.exports=router;