import feed from '../fixtures/feed';
import page from '../fixtures/page';

var feedFrame = document.getElementById('feed');
var pageFrame = document.getElementById('page');

window.polySolvePage(feed, {}, (err, html, config) => (feedFrame.src = "data:text/html;charset=utf-8,"+html));

window.polySolvePage(page, {}, (err, html, config) => (pageFrame.src = "data:text/html;charset=utf-8,"+html));