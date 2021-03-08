const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    exams: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'exam'
    }
});

module.exports = Teacher = mongoose.model('teacher',TeacherSchema);