const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    genre: {
        type: [String], // updated to support multiple genres
    },
    genreSelected: {
        type: Boolean, // updated to use a boolean flag
        default: false,
    }
});

const UserModel = mongoose.model('users', userSchema);
module.exports = UserModel;
