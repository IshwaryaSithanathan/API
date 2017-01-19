var loginTemplate = __dirname + '/../views/login'
var homePageTemplate = __dirname + '/../views/home'

var exports = module.exports

exports.getLogin = function (req, res) {
  res.render(loginTemplate)
}

exports.logout = function (req, res) {
  req.logout()
  req.flash('success_msg', 'You are logged out')
  res.redirect('/')
}

exports.renderPage = function (req, res) {
  res.render(homePageTemplate)
}
