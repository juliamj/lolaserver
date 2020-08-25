// Establish connection to the database
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})
    .then(() => console.log('Connected successfully to the db!'))

const client = mongoose.connection;

client.on('error', (err) => {
    console.error(err)
})

module.exports = client