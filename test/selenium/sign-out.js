const selenium = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const browser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
const expect = require('chai').expect;

const server_url = 'http://localhost:3000';
const username = 'hello@gmail.com';
const password = 'this';

browser.get(server_url);
var err = false;

try {
    /** Login works and visits main app page */
    browser.findElement(webdriver.By.css('body > div > p:nth-child(3) > a.btn.btn-warning.btn-lg')).click();
    browser.sleep(200);
    browser.findElement(webdriver.By.css('#local > a:nth-child(1)')).click();
    browser.sleep(200);
    browser.findElement(webdriver.By.css('#inputEmail')).sendKeys(username);
    browser.findElement(webdriver.By.css('#inputPassword')).sendKeys(password);
    browser.findElement(webdriver.By.css('#local-sign-in > div:nth-child(3) > div > input')).click();
    browser.wait(webdriver.until.titleIs('Fuse Chat'), 2000);
} catch (e) {
    err = true;
}

// sanity check: log in works
expect(err).to.eql(false);

// Once we are in the app
// Signing out shoud work

/** sidebar */
browser.findElement(webdriver.By.css('#bs-example-navbar-collapse-2 > ul:nth-child(1) > li:nth-child(2)')).click();
browser.sleep(200);
browser.wait(webdriver.until.titleIs('Sign in to Fuse Chat'), 2000);
console.log('✔ sign out works when logged in');

