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
// Expect to find common UI elements

/** sidebar */
expect(browser.findElement(webdriver.By.css('.fc-sidebar')) != null).to.equal(true);
console.log('✔ groups sidebar exists');

/** top navbar */
expect(browser.findElement(webdriver.By.css('#bs-example-navbar-collapse-2')) != null).to.equal(true);
console.log('✔ top navbar exists');

/** input */
expect(browser.findElement(webdriver.By.css('body > div.fc-main-container > div.fc-chat-view > div.chat-input')) != null).to.equal(true);
console.log('✔ chat input box exists');

/** chat send button */
expect(browser.findElement(webdriver.By.css('#fc-message-form > button')) != null).to.equal(true);
console.log('✔ chat send button exists');


// Modals pop-up

/** create group */
browser.findElement(webdriver.By.css('#bs-example-navbar-collapse-2 > ul:nth-child(1) > li:nth-child(1)')).click();
expect(browser.findElement(webdriver.By.css('#fc-create-group')) != null).to.equal(true);
browser.findElement(webdriver.By.css('#fc-create-group > div > div > div.modal-footer > button.btn.btn-default.fc-cancel')).click();
console.log('✔ create groups button works exists');

/** preferences */
browser.findElement(webdriver.By.css('#bs-example-navbar-collapse-2 > ul.nav.navbar-nav.navbar-right > li:nth-child(3)')).click();
browser.sleep(200);
expect(browser.findElement(webdriver.By.css('#fc-preferences')) != null).to.equal(true);
browser.findElement(webdriver.By.css('#fc-preferences > div > div > div.modal-footer > button.btn.btn-default.fc-preferences-cancel')).click();
console.log('✔ preferences dialog works');



