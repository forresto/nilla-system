import {encode} from 'he';

const line = "\n";
const ind = '  ';

function escape (html) {
  return encode(html, {'useNamedReferences': true});
}

function removeLast (str, search) {
  let split = str.split('/');
  if (split[split.length-1] === 'index.html') {
    split[split.length-1] = '';
    str = split.join('/')
  }
  return str;
}

function renderTitle (block) {
  let html = '';
  if (block.metadata && block.metadata.title)
    html += `<h2>${encode(block.metadata.title)}</h2>`;
  return html;
}

function renderAttribution (block) {
  let html = '';
  if (block.metadata && block.metadata.author && block.metadata.author.length) {
    let authors = block.metadata.author.map(author => {
      let span = `<span>`
      if (author.url)
        span += `<a href="${author.url}">`;
      if (author.name)
        span += escape(author.name);
      else
        span += 'credit';
      if (author.url)
        span += `<a href="${author.url}">`;
      span += `</span>`
    });
    html += `<p>${authors.join(', ')}</p>`;
  }
  return html;
}

function renderCover (block) {
  let html = '';
  console.log(block.cover);
  if (block.cover && block.cover.src) {
    html += `<div><img src="${block.cover.src}"`;
    if (block.metadata && block.metadata.caption)
      html += ` alt="${encode(block.metadata.caption)}"`
    html += ` /></div>`;
  }
  return html;
}

function renderBlock (block) {
  return `\n<section>
      ${renderCover(block)}
      ${renderTitle(block)}
      ${renderAttribution(block)}
    </section>`;
}

// Just wrap each item in a section, and output the HTML as provided by API
export default function (page, options, callback) {

  let html = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${escape(page.title)}</title>
        <link rel="stylesheet" href="https://d2v52k3cl9vedd.cloudfront.net/basscss/7.0.4/basscss.min.css">
      </head>
    <body>`;

  // html += "<!-- debug:\n" + JSON.stringify(page, null, 2) + "\n-->";

  html += line + "<header>" + line + "<nav>";
  page.navigation.forEach(nav => {
    let link = page.siteUrl + nav.href;
    link = removeLast(link, 'index.html');
    html += line + ind + '<a href="'+link+'" class="btn py2">'+nav.title+'</a>';
  });
  html += line + "</nav>" + line + "</header>";

  page.items.forEach(item => {
    item.content.forEach(block => {
      html += renderBlock(block);
    });
  });

  html += line+"</body></html>";
  let err = null;
  let details = {};
  return callback(err, html, details);

};
