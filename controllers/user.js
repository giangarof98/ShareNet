const User = require('../models/user');

module.exports.register = (req,res) => {
    res.render('user/register')
}

module.exports.renderRegister = async(req,res) => {
    try{
        const {email,username, password} = req.body;
        const user = new User({email, username});
        const registered = await User.register(user, password);
        req.login(registered, err => {
            if(err) return next(err);
            req.flash('success', 'welcome!');
            res.redirect('/')
        })
    } catch(e){
        req.flash('error', e.message);
        res.redirect('register')
    }
}

module.exports.login = (req,res) => {
    res.render('user/login')
}

module.exports.renderLogin = (req,res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/content'
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'GoodBye!');
    res.redirect('/')
}