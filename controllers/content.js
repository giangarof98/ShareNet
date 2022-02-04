const content = require('../models/content');
const Content = require('../models/content');

module.exports.index = async (req, res) => {
    const contents = await Content.find({})
    res.render('content', {contents})
}

module.exports.newForm = async (req, res) => {
    res.render('new')
}

module.exports.create = async(req, res, next) => {
    // if(!req.body.content) throw new expressError('invalid data', 400);
    const content = new Content (req.body.content);
    content.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    content.owner = req.user._id
    console.log(content)
    await content.save();
    req.flash('success', 'successfully made a new post!')
    res.redirect(`/content/${content._id}`)
}

module.exports.showContent = async (req,res) => {
    // const{id} = req.params;
    const content = await Content.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'owner'
            }
        }).populate('owner');
    console.log(content)
    res.render('show', {content})
}

module.exports.editForm = async(req,res) => {
    const {id} = req.params;
    const content = await Content.findById(req.params.id)
    res.render('edit', {content})
}

module.exports.updateContent = async(req,res)=> {
    const {id} = req.params;
    const content = await Content.findByIdAndUpdate(id,{...req.body.content})
    // const img = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // content.images.push(...img)
    await content.save()
    req.flash('success', 'successfully updated post!')
    res.redirect(`/content/${content._id}`)
}

module.exports.deleteContent = async(req,res) => {
    const {id} = req.params;
    await Content.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted post!')
    res.redirect('/content')
}

module.exports.userLike = async (req,res) => {
    Content.findById(req.params.id, (err, foundCont) => {
        if(err){
            console.log(err);
            return res.redirect('/content/')
        }

        const liked = foundCont.likes.some((like) => {
            return like.equals(req.user._id);
        });

        if(liked) {
            foundCont.likes.pull(req.user._id);
        } else {
            foundCont.likes.push(req.user);
        }

        foundCont.save((err) => {
            if(err){
                console.log(err);
                return res.redirect('/content/');
            }
            return res.redirect('/content/' + foundCont._id);
        })
    })
}