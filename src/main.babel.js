import imgflo from 'imgflo-url';
import {escape} from './util';
import Nav from './nav';
import calcSectionColors from './calcSectionColors';
import React from 'react';
import Cover, {getAllImageSources} from './Cover';

const MAX_WIDTH = 1280;
const HTML_TYPES = ['h1','h2','h3','h4','h5','h6','text','quote','list'];

let imgfloConfig;

function renderDescription (block) {
  let html = '';
  if (block.metadata && block.metadata.description)
    html += `<p>${escape(block.metadata.description)}</p>`;
  return html;
}

function renderAttribution (block) {
  let {metadata} = block;
  if (!metadata) return '';

  let {isBasedOnUrl, url, title, author} = metadata;
  let permalink = url || isBasedOnUrl;

  let links = [];
  if (permalink || title) {
    let span = `<span>`;
    if (permalink)
      span += `<a href="${permalink}">`;
    if (title)
      span += escape(title);
    else if (permalink)
      span += `link`;
    if (permalink)
      span += `</a>`;
    span += `</span>`;
    links.push(span);
  }
  if (author && author.length) {
    let authors = author.map(auth => {
      let {url, name} = auth;
      let span = `<span>`
      if (url)
        span += `<a href="${url}">`;
      if (name)
        span += escape(name);
      else if (url)
        span += 'credit';
      if (url)
        span += `</a>`;
      span += `</span>`
      return span;
    });
    links.push(authors.join(', '));
  }
  return `<p>${links.join(' / ')}</p>`;
}

function renderCover (block) {
  let html = '';
  if (block.cover && block.cover.src && imgfloConfig) {
    let {metadata, cover} = block;
    let props = {metadata, cover, imgfloConfig};
    let img = <Cover {...props} />;
    // TODO: renderToString for isomorphic fun
    html += React.renderToStaticMarkup(img);
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
    ${renderHTML(block)}
    ${renderCover(block)}
    ${renderAttribution(block)}
    ${renderDescription(block)}
  `;
}

// Just wrap each item in a section, and output the HTML as provided by API
export default function (page, options, callback) {
  let startTime = Date.now();
  let html = '';
  let err = null;
  let details = {};

  try {
    imgfloConfig = page.config.image_filters;

    html += `<!doctype html>
      <html amp>
      <head>
        <meta charset="utf-8">
        <title>${escape(page.title)}</title>
        <link rel="canonical" href="index.html" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
        <link rel="stylesheet" href="https://d2v52k3cl9vedd.cloudfront.net/basscss/7.0.4/basscss.min.css">
        <style amp-custom>
          body {
            margin: 0;
            padding: 0;
          }
          h1,h2,h3,h4,h5,h6,p,ul,ol,blockquote { 
            max-width: 950px; 
          }
          .btn-link:hover { 
            text-decoration: underline; 
          }
          .white a { 
            color: white; 
            text-decoration: underline; 
          }
          .black a { 
            color: black; 
            text-decoration: underline; 
          }
          section {
            border-left: 1em solid black;
          }
        </style>
        <script async custom-element="amp-image-lightbox" src="https://cdn.ampproject.org/v0/amp-image-lightbox-0.1.js"></script>
        <style>body {opacity: 0}</style><noscript><style>body {opacity: 1}</style></noscript>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
      </head>
      <body>`;

    html += `\n<header class="p1">`;
    html += Nav(page.navigation, page.path);
    html += `</header>`;

    page.items.forEach(item => {
      let sectionColors = calcSectionColors(item);
      html += `\n<section class="p2" style="${sectionColors.style}">`;
      item.content.forEach(block => {
        html += renderBlock(block);
      });
      html += `\n</section>`;
    });

    html += `\n<footer class="p1">`;
    html += Nav(page.links, page.path);
    html += `</footer>`;

    // Debug info
    details.solveTime = Date.now() - startTime;
    // let itemsString = JSON.stringify(page.items, null, 2);
    // html += `\n<!-- solve time: ${details.solveTime}ms
    //   page.items = ${itemsString};
    // -->`;

    html += `\n</body>`;
    html += `\n</html>`;

    // Used for imgflo preheating
    details.images = getAllImageSources();

    return callback(err, html, details);
  } catch (error) {
    return callback(error, null, details);
  }
};
