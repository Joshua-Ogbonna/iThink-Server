const mongoose = require('mongoose')

// create a mongoose schema
const Schema = mongoose.Schema

// Get thoughts model
const ThoughtSchema = new Schema({
    thoughts: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true})

const Thoughts = mongoose.model('thoughts', ThoughtSchema)

module.exports = Thoughts