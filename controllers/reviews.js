const Review = require('../models/review');
const Content = require('../models/content');

module.exports.createComment = async(req,res) => {
    const content = await Content.findById(req.params.id);
    const review = new Review(req.body.review);
    review.owner = req.user._id
    content.reviews.push(review);
    await review.save();
    await content.save();
    req.flash('success', 'Comment created!')
    res.redirect(`/content/${content._id}`)
}

module.exports.deleteComment = async(req,res) => {
    const{id, reviewid} = req.params;
    await Content.findByIdAndUpdate(id, {$pull: {reviews:reviewid}})
    await Review.findByIdAndDelete(reviewid)
    res.redirect(`/content/${id}`)
}
