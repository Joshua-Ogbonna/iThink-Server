const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const passport = require('passport')
const morgan = require('morgan')


// Initialize app
const app = express()

// Initialize port
const PORT = process.env.PORT || 3200

// Use bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))

// Use the passport middleware
app.use(passport.initialize())
app.use(morgan('dev'))

require('./config/passport')(passport)

// Use CORS
app.use(cors())

// Connect to MongoDB Database
const db = require('./config/connection').mongoURI
mongoose.connect(db, { useNewUrlParser: true , useUnifiedTopology: true}).then(() => {
    console.log(`Database connected successfully at ${db}`)
})


// Import Routes
const userRoute = require('./routes/user')
const thoughtRoute = require('./routes/thoughts')

app.use('/api', userRoute)
app.use('/api', thoughtRoute)

app.listen(PORT, () => {
    console.log(`App is listening on Port ${PORT}`)
})