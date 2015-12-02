const selenium = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const browser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
const expect = require('chai').expect;

const server_url = 'http://localhost:3000'
browser.get(server_url);

/** Two buttons for sign-in and register */
browser.findElements(webdriver.By.css('[method="post"]')).then(function(buttons){
    console.log('✔ Found', buttons.length, 'buttons for login and register' );
    expect(buttons.length).to.eql(2);
});

/** Local sign in button exists */
browser.findElements(webdriver.By.css('[href="#local"]')).then(function(links){
    console.log('✔ Found', links.length, 'major button for local sign-in' );
    expect(links.length).to.eql(1);
});

/** Google sign in button exists */
browser.findElements(webdriver.By.css('[href="/auth/google"]')).then(function(links){
    console.log('✔ Found', links.length, 'major button for Google sign-in' );
    expect(links.length).to.eql(1);
});

/** facebook sign in button exists */
browser.findElements(webdriver.By.css('[href="/auth/facebook"]')).then(function(links){
    console.log('✔ Found', links.length, 'major button for facebook sign-in' );
    expect(links.length).to.eql(1);
    browser.quit();
});
