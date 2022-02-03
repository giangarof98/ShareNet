const express = require('express');
const passport = require('passport');
const router = express.Router();

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const userController = require('../controllers/user')


router.get('/register', userController.register)

router.post('/register', catchAsync(userController.renderRegister))

router.get('/login', userController.login)

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userController.renderLogin)

router.get('/logout', userController.logout)


module.exports = router;