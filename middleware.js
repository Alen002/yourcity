module.exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
      return next();
  }
  console.log(req.path, req.originalUrl);
  res.redirect('/login');
};

