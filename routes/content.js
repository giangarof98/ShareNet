const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const contentController  = require('../controllers/content')
const {logged, validateContent, auth} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage})

router.get('/', logged, catchAsync(contentController.index))

router.get('/new', logged, catchAsync(contentController.newForm))

router.get('/:id', logged, catchAsync(contentController.showContent))

router.post('/', logged, upload.array('image'), validateContent, catchAsync(contentController.create))

router.get('/:id/edit', logged, auth, catchAsync(contentController.editForm))

router.put('/:id', logged, auth, upload.array('image'), validateContent, catchAsync(contentController.updateContent))

router.delete('/:id', logged, auth, catchAsync(contentController.deleteContent))

router.post('/:id/like', logged, catchAsync(contentController.userLike))

module.exports = router;