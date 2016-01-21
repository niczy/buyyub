var fs = require('fs');
var phantom = require('phantom');

console.log('Start processing coach new arrival.');
var parseCoach = function parseCoach(ph) {
  ph.createPage(function (page) {
    console.log('Opening coach page.');
    page.open('http://www.coach.com/shop/women-handbags-new-arrivals', function(status) {
      console.log("Status: " + status);
      if(status === "success") {
        page.render('coach-women-handbags-new-arrivals.png');
        console.log('image is rendered.');
        itemList = page.evaluate(function() {
          itemList = document.querySelectorAll('.prod-grid');
          ret = [];
          for (var i = 0; i < itemList.length; i++) {
            item = itemList[i];
            metas = item.querySelector('.product-name').querySelectorAll('meta');
            nameMeta = metas[0];
            product = {};
            product.name = nameMeta.getAttribute("content");
            ret.push(product);
          }
          console.log('Phantom is closed.');
          console.log('ret is ' + JSON.stringify(ret));
          return ret;
        });
        fs.writeFile('item-list.js', JSON.stringify(itemList));
        ph.exit();
      }
    });
  });
};

var wait = function() {
  setTimeout(wait, 1000);
}

phantom.create(function (ph) {
  console.log('Phantom is created.');
  parseCoach(ph);
});
wait();
