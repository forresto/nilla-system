import {escape} from './util';
import {resolveRelativeUrl} from '@design-systems/url-helper';

// Make <nav> from an array of links

const titleMap = {
  alternate: 'rss',
  previous: '←',
  next: '→',
};

export default function (links, from) {
  if (!links || !links.length)
    return ``;

  let html = `\n<nav>`;
  links.forEach(nav => {
    let {href, rel, title} = nav;
    let url = resolveRelativeUrl(href, from);
    if (!url)
      url = './'
    if (titleMap[rel])
      title = titleMap[rel];
    if (!title)
      title = rel;
    if (!title)
      title = 'link';
    html += `<a href="${url}" rel="${rel}" class="btn btn-link p1">${escape(title)}</a>`;
  });
  html += `</nav>`;

  return html;
}