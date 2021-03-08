const mongoose = require('mongoose');

const ParentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    student: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    }
});

module.exports = Parent = mongoose.model('parent',ParentSchema);