var base_url = 'http://159.203.96.164' || 'http://localhost:3000';

casper.test.begin("Find sign-in buttons", 1, function(test) {
  casper.start(base_url + '/signin', function() {
    test.assertExists('.btn-warning'); // local
    test.assertExists('.btn-danger'); // google
    test.assertExists('a.btn:nth-child(3)'); // sign-in
  }).run(function() {
    setTimeout(function(){
        test.done();
        phantom.exit();
    }, 0);
  });
});

