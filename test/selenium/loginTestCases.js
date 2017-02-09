var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until
var chrome = require('selenium-webdriver/chrome')
var path = require('chromedriver').path
var chai = require('chai')
var expect = chai.expect

var service = new chrome.ServiceBuilder(path).build()
chrome.setDefaultService(service);


describe('Login Page', function () {
    beforeEach(function (done) {
        this.driver = new webdriver.Builder().
            withCapabilities(webdriver.Capabilities.chrome()).
            build()
        this.driver.get('http://localhost:3000/').then(done)
    })

    it('Logging in with valid credentials', function (done) {
        this.driver.findElement(By.id('username')).sendKeys('admin')
        this.driver.findElement(By.id('password')).sendKeys('admin')
        this.driver.findElement(By.id('loginSubmit')).click()
        this.driver.findElement(By.id('home')).then(function (element) {
            console.log('Yes, Logged in')
            done()
        }, function (error) {
            console.log('The element was not found, as expected')
        })
    })

    it('Logging in with invalid credentials', function (done) {
        this.driver.findElement(By.id('username')).sendKeys('adminwwwd')
        this.driver.findElement(By.id('password')).sendKeys('admicdsn')
        this.driver.findElement(By.id('loginSubmit')).click()
        this.driver.findElement(By.className('alert-danger')).then(function (element) {
            element.getText().then(function (textValue) {
                expect(textValue).to.equal('Unknown User')
                done()
            })
        }, function (error) {
            return error
        })
    })

    it('Empty input', function (done) {
        this.driver.findElement(By.id('username')).sendKeys('')
        this.driver.findElement(By.id('password')).sendKeys('')
        this.driver.findElement(By.id('loginSubmit')).click()
        this.driver.findElement(By.className('alert-danger')).then(function (element) {
            element.getText().then(function (textValue) {
                expect(textValue).to.equal('Missing credentials')
                done()
            })
        }, function (error) {
            return error
        })
    })

    it('Incorrect password', function (done) {
        this.driver.findElement(By.id('username')).sendKeys('admin')
        this.driver.findElement(By.id('password')).sendKeys('gsfgs')
        this.driver.findElement(By.id('loginSubmit')).click()
        this.driver.findElement(By.className('alert-danger')).then(function (element) {
            element.getText().then(function (textValue) {
                expect(textValue).to.equal('Incorrect password')
                done()
            })
        }, function (error) {
            return error
        })
    })

    afterEach(function (done) {
        this.driver.quit().then(done);
    })
})