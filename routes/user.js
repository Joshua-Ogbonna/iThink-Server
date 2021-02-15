const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const key = require('../config/connection').secret
const passport = require('passport')
// Generate express router
const router = express.Router()

// Require cryptr for data encryption
const Cryptr = require('cryptr')
const cryptr = new Cryptr('totallySecretData')

// Import User Model
const User = require('../models/User')
const Thought = require('../models/Thought')
const Thoughts = require('../models/Thought')

// Initialize routes and controllers

/**
 * @POST Route Signup
 * Public
 */
router.post('/signup', (req, res) => {
    let { 
        name,
        email, 
        password, 
        confirm_password 
    } = req.body

    
    User.findOne({email: req.body.email})
        .then((user) => {
            if (user) {
                res.status(402).json({
                    msg: 'Email is already taken'
                })
            }
        })

    if(password !== confirm_password) {
        res.status(400).json({
            msg: "Password does not match"
        })
    } else {
        
        const newUser = new User({
            name,
            email,
            password
        })

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err
                newUser.password = hash
                newUser.save().then(() => {
                    return res.status(201).json({
                        success: true,
                        msg: "User successfully created"
                    })
                }).catch(err => {
                    res.status(401).json({
                        error: err  
                    })
                })
            })
        })
    }
})


/**
 * @POST Route Login
 * Public
 */
router.post('/login', (req, res) => {
    User.findOne({email: req.body.email}).then((user) => {
        if(!user) {
            return res.status(402).json({
                error: "email address not found! Please kindly register."
            })
        }

        bcrypt.compare(req.body.password, user.password).then(isMatch => {
            if(isMatch) {
                const payload = {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }

                jwt.sign(payload, key, { expiresIn: '24h'}, (err, token) => {
                    res.status(201).json({
                        success: true,
                        user: user,
                        token: `Bearer ${token}`,
                        msg: "Welcome to Diaries! Login successful"
                    })
                })
            } else {
                return res.status(402).json({
                    msg: "Passwords do not match!"
                })
            }
        })
    })
})


/**
 * @POST Route Post for thoughts
 * Private
 */
router.post('/user/:id', (req, res) => {
    Thought.create(req.body).then(thoughtSuccess => {
        return User.findOneAndUpdate({ _id: req.params.id }, { $push: {thoughts: thoughtSuccess._id}}, { new: true })
    }).then(dbThought => {
        res.status(201).json({ msg: dbThought, success: true})
    }).catch(error => {
        res.status(401).json(error)
    })
})

/**
 * @GET Route for users
 * Private
 */

router.get('/user', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        user: req.user
    })
})

/**
 * @GET Request for thoughts
 */
router.get('/user/:id', (req, res) => {
    User.findOne({ _id: req.params.id }).populate('thoughts').then(userThoughts => {
        res.status(200).json({
            success: true,
            diary: userThoughts.thoughts,
            msg: 'Your diaries'
        })
    }).catch(error => {
        res.status(404).json(error)
    })
})

router.get('/thoughts', (req, res) => {
    User.find({}).populate('thoughts').then(userThoughts => {
        res.status(200).json({
            success: true,
            diary: userThoughts,
            msg: 'Your diaries'
        })
    }).catch(error => {
        res.status(404).json(error)
    })
})


module.exports = router