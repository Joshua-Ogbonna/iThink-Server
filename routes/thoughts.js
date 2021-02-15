const express = require('express')
const router = express.Router()

// Import Thoughts Model
const Thoughts = require('../models/Thought')

/**
 * @POST Thoughts routes
 * Private
 */
router.post('/thoughts', (req, res) => {
    let thought = new Thoughts({
        title: req.body.title,
        thoughts: req.body.thoughts
    })

    // Save thoughts
    thought.save().then(thought => {
        res.status(201).json({
            thought
        })
    })
})

/**GET single Thought */
router.get('/thoughts/:id', (req, res) => {
    Thoughts.findById({_id: req.params.id}).exec().then(data => {
        if(data) {
            res.json(data)
        } else {
            res.json("Data not found")
        }
    }).catch(error => {
        res.status(404).json(error)
    })
})


// Edit Single Thought
router.put('/thoughts/:id', (req, res, next) => {
    let newThought = req.body
    Thoughts.findByIdAndUpdate({_id: req.params.id}, newThought, {new: true}).exec().then(data => {
        res.send(data)

    }).catch(error => {
        res.status(400).send(error)
    })
})

/**DELETE Single Thought */
router.delete('/thoughts/:id', (req, res, next) => {
    Thoughts.findByIdAndDelete({_id: req.params.id}).exec().then(() => {
        res.json("Deleted successfully!")
    }).catch(error => {
        res.status(400).send(error)
    })
})

module.exports = router