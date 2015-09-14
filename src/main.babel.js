import imgflo from 'imgflo-url';
import {encode} from 'he';

const line = "\n";
const ind = '  ';
const maxWidth = 1280;

let imgfloConfig;

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

function renderDescription (block) {
  let html = '';
  if (block.metadata && block.metadata.description)
    html += `<p>${encode(block.metadata.description)}</p>`;
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

function sizeByWidth (cover) {
  let {width, height} = cover;
  if (!width || !height) {
    return {width: maxWidth};
  } else if (width <= maxWidth) {
    return {width: width, height: height};
  } else {
    let scale = maxWidth/width
    return {
      width: Math.round(width*scale),
      height: Math.round(height*scale)
    }
  }
}

function sizeAndProxyImage (cover) {
  let {src, width, height} = cover;
  let imgfloParams = sizeByWidth(cover);
  imgfloParams.input = src;
  return {
    src: imgflo(imgfloConfig, 'passthrough', imgfloParams),
    width: imgfloParams.width,
    height: imgfloParams.height
  }
}

function renderCover (block) {
  let html = '';
  if (block.cover && block.cover.src && imgfloConfig) {
    let {src, width, height} = sizeAndProxyImage(block.cover);
    html += `<div><img src="${src}" `;
    // if (width)
    //   html += `width="${width}" `
    // if (height)
    //   html += `height="${height}" `
    if (block.metadata && block.metadata.caption)
      html += `alt="${encode(block.metadata.caption)}" `
    html += `/></div>`;
  }
  return html;
}

function renderHTML (block) {
  if (['h1','h2','h3','h4','h5','h6','text','quote'].indexOf(block.type) === -1)
    return '';
  if (block.html)
    return block.html;
  return '';
}

function renderBlock (block) {
  return `
    ${renderCover(block)}
    ${renderTitle(block)}
    ${renderAttribution(block)}
    ${renderDescription(block)}
    ${renderHTML(block)}
  `;
}

// Just wrap each item in a section, and output the HTML as provided by API
export default function (page, options, callback) {
  let html = '';
  let err = null;
  let details = {};

  try {
    imgfloConfig = page.config.image_filters

    html += `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${escape(page.title)}</title>
          <link rel="stylesheet" href="https://d2v52k3cl9vedd.cloudfront.net/basscss/7.0.4/basscss.min.css">
        </head>
      <body>`;

    // html += "<!-- debug:\n" + JSON.stringify(page, null, 2) + "\n-->";

    html += `
      <header class="m1">
        <nav>
    `;
    page.navigation.forEach(nav => {
      let link = page.siteUrl + nav.href;
      link = removeLast(link, 'index.html');
      html += `<a href="${link}" class="btn btn-primary black bg-darken-1 mr1">${nav.title}</a>`;
    });
    html += `
        </nav>
      </header>
    `;

    page.items.forEach(item => {
      html += `<section>`;
      // html += renderBlock(item);
      item.content.forEach(block => {
        html += renderBlock(block);
      });
      html += `</section>`;
    });

    html += `
      <footer class="m1">
        <nav>
    `;
    page.links.forEach(nav => {
      let {href, rel} = nav;
      let url = page.siteUrl + href;
      let titleMap = {
        alternate: 'rss',
        previous: '&#8592;',
        next: '&#8594;',
      };
      let title = titleMap[rel] ? titleMap[rel] : rel;
      html += `<a href="${url}" class="btn btn-primary black bg-darken-1 mr1">${title}</a>`;
    });
    html += `
        </nav>
      </footer>
    `;

    html += `
      </body>
    </html>`;

    return callback(err, html, details);
  } catch (error) {
    return callback(error, null, details);
  }
};
