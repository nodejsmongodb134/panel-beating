module.exports = function(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    } else {
        req.flash('error', 'You are not authorized to view this page.');
        res.redirect('/auth/login');
    }
};
