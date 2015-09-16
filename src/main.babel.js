import imgflo from 'imgflo-url';
import {escape} from './util';
import Nav from './nav';

const line = "\n";
const ind = '  ';
const maxWidth = 1280;
const HTML_TYPES = ['h1','h2','h3','h4','h5','h6','text','quote','list'];

let imgfloConfig;

function renderTitle (block) {
  let html = '';
  if (block.metadata && block.metadata.title)
    html += `<h2>${escape(block.metadata.title)}</h2>`;
  return html;
}

function renderDescription (block) {
  let html = '';
  if (block.metadata && block.metadata.description)
    html += `<p>${escape(block.metadata.description)}</p>`;
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
      html += `alt="${escape(block.metadata.caption)}" `
    html += `/></div>`;
  }
  return html;
}

function renderHTML (block) {
  if (HTML_TYPES.indexOf(block.type) === -1)
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
  let startTime = Date.now();
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
          <style>
            .btn-link:hover { text-decoration: underline; }
          </style>
        </head>
      <body>`;

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

    // Debug info
    let solveTime = Date.now() - startTime;
    let itemsString = JSON.stringify(page.items, null, 2);
    html += `\n<!-- solve time: ${solveTime}ms
      page.items = ${itemsString};
    -->`;

    html += `\n</body>`;
    html += `\n</html>`;

    return callback(err, html, details);
  } catch (error) {
    return callback(error, null, details);
  }
};
