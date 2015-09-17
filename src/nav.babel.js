import {escape} from './util';

// Make <nav> from an array of links

const titleMap = {
  alternate: 'rss',
  previous: '←',
  next: '→',
};

function removeLast (str, by='/', search='index.html') {
  let split = str.split(by);
  if (split[split.length-1] === search) {
    split[split.length-1] = '';
    str = split.join(by);
  }
  return str;
}

export default function (links, siteUrl='') {
  if (!links || !links.length)
    return ``;

  let html = `\n<nav>`;
  links.forEach(nav => {
    let {href, rel, title} = nav;
    let url = removeLast(siteUrl + href);
    if (titleMap[rel])
      title = titleMap[rel];
    html += `<a href="${url}" rel="$rel" class="btn btn-link p1">${escape(title)}</a>`;
  });
  html += `</nav>`;

  return html;
}