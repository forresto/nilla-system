import feed from '../fixtures/feed';
import page from '../fixtures/page';

function renderIframe (id, html) {
  let iframe = document.getElementById(id)
  iframe.src = "data:text/html;charset=utf-8,"+encodeURIComponent(html);
  // iframe.contentWindow.location.hash = 'development=1';
}

window.polySolvePage(feed, {}, (err, html, details) => {
  if (err) {
    console.warn(err);
    return;
  }
  renderIframe('feed', html);
  console.log(details);
});
window.polySolvePage(page, {}, (err, html, details) => {
  if (err) {
    console.warn(err);
    return;
  }
  renderIframe('page', html);
  console.log(details);
});
