var path = require('path')
var loginTemplate = path.join(__dirname, '/../views/login')
var homePageTemplate = path.join(__dirname, '/../views/home')

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

var exports = module.exports
