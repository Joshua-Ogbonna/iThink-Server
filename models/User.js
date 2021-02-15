const mongoose = require('mongoose')

// Get the mongoose schema constructor
const Schema = mongoose.Schema

// Create a user schema based on this
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
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
    thoughts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'thoughts'
        }
    ]
})

module.exports = User = mongoose.model('user', UserSchema)