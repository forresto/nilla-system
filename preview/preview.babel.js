import feed from '../fixtures/feed';
import page from '../fixtures/page';

function renderIframe (id, html) {
  document.getElementById(id).src = "data:text/html;charset=utf-8,"+encodeURIComponent(html);
}

window.polySolvePage(feed, {}, (err, html, config) => renderIframe('feed', html) );
window.polySolvePage(page, {}, (err, html, config) => renderIframe('page', html) );
