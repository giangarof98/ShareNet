const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;
const {cloudinary} = require('../cloudinary')

const contentSchema = new Schema ({
    title: String,
    // image: String,
    images: [{
        url: String,
        filename: String
    }],
    description: String,
    likes: [
        {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

contentSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
        for(let img of doc.images){
            await cloudinary.uploader.destroy(img.filename)
        }
    }
})

module.exports = mongoose.model('Content', contentSchema)
