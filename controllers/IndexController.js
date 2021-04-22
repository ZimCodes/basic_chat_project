exports.index = (req,res,next)=> {
    res.render('login',{layout:'other'});
};
exports.chat = (req,res,next)=> {
    res.render('chat');
};
exports.submit = (req,res,next)=> {
    res.redirect('/chat');
};
