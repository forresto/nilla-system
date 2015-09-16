// Make <nav> from an array of links

const titleMap = {
  alternate: 'rss',
  previous: '&#8592;',
  next: '&#8594;',
};

export default function (links, siteUrl='') {
  if (!links || !links.length)
    return ``;

  let html = `\n<nav>`;
  links.forEach(nav => {
    let {href, rel, title} = nav;
    let url = siteUrl + href;
    if (titleMap[rel])
      title = titleMap[rel];
    html += `<a href="${url}" rel="$rel" class="btn compact btn-link p1">${title}</a>`;
  });
  html += `</nav>`;

  return html;
}