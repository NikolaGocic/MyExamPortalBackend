const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    type: {      //Admin,Teacher,Student,Parent
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        default: "https://az-pe.com/wp-content/uploads/2018/05/kemptons-blank-profile-picture.jpg"
    },
    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = User = mongoose.model('user', UserSchema);