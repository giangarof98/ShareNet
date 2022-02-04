const Content = require('../models/content');
const mongoose = require('mongoose')
const dbUrl = process.env.DB_URL
// 'mongodb://localhost:27017/sharenet'
mongoose.connect(dbUrl || 'mongodb://localhost:27017/sharenet', {
    useNewUrlParser: true,
    useUnifiedTopology: true})
.then(() => console.log('connected with mongodb'))
.catch((error) => console.error(error))

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log('Database connected!')
})

// const del = async () => {
//     await Content.deleteMany({});
//     const c = new Content({title:'skynet'});
//     await c.save();
// }

// del().then(() => {
//     mongoose.connection.close()
// })