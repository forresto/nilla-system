import imgflo from 'imgflo-url';
import {encode} from 'he';

import Nav from './nav';

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

    html += `\n<header class="m1">`;
    html += Nav(page.navigation, page.siteUrl);
    html += `</header>`;

    page.items.forEach(item => {
      html += `\n<section>`;
      // html += renderBlock(item);
      item.content.forEach(block => {
        html += renderBlock(block);
      });
      html += `\n</section>`;
    });

    html += `\n<footer class="m1">`;
    html += Nav(page.links, page.siteUrl);
    html += `</footer>`;

    html += `
      </body>
    </html>`;

    return callback(err, html, details);
  } catch (error) {
    return callback(error, null, details);
  }
};
