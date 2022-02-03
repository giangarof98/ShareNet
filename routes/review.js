const express = require('express');
const router = express.Router({mergeParams:true});

const catchAsync = require('../utils/catchAsync');
const {validateReview, logged, authReview} = require('../middleware')
// const Review = require('../models/review');
// const Content = require('../models/content');
const reviewController = require('../controllers/reviews')

router.post('/', logged, validateReview, catchAsync(reviewController.createComment))

router.delete('/:reviewid', logged, authReview, catchAsync(reviewController.deleteComment))


module.exports = router;