const {contentSchema, reviewSchema} = require('./validationSchema');
const expressError = require('./utils/ExpressErrors');
const Content = require('./models/content');
const Review = require('./models/review');


module.exports.logged = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed first.')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateContent = (req,res,next) => {
    const {error} = contentSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else { next() }
}

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else { next() }
}

module.exports.auth = async(req,res,next) => {
    const {id} = req.params;
    const contentOwner = await Content.findById(req.params.id);
    if(!contentOwner.owner.equals(req.user.id)){
        req.flash('error', 'You do not have permission to update')
        return res.redirect(`/content/${id}`)
    }
    next()
}

module.exports.authReview = async(req,res,next) => {
    const {id, reviewid} = req.params;
    const review = await Review.findById(reviewid);
    if(!review.owner.equals(req.user.id)){
        req.flash('error', 'You do not have permission to update')
        return res.redirect(`/content/${id}`)
    }
    next()
}