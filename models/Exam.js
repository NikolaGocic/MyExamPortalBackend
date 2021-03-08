const { json } = require('express');
const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    dateAndTime: {
        type: Date,
    },
    questions: {
        type: [String],
        required: true
    },
    answers: {
        type: [String],
    }
});

module.exports = Exam = mongoose.model('exam',ExamSchema);