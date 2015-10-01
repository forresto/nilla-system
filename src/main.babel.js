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
  if (!block.metadata)
    return '';
  let links = [];
  if (block.metadata.isBasedOnUrl || block.metadata.title) {
    let title = `<span>`;
    if (block.metadata.isBasedOnUrl)
      title += `<a href="${block.metadata.isBasedOnUrl}">`;
    if (block.metadata.title)
      title += escape(block.metadata.title);
    else if (block.metadata.isBasedOnUrl)
      title += `source`;
    if (block.metadata.isBasedOnUrl)
      title += `</a>`;
    title += `</span>`;
    links.push(title);
  }
  if (block.metadata.author && block.metadata.author.length) {
    let authors = block.metadata.author.map(author => {
      let span = `<span>`
      if (author.url)
        span += `<a href="${author.url}">`;
      if (author.name)
        span += escape(author.name);
      else if (author.url)
        span += 'credit';
      if (author.url)
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
    imgfloConfig = page.config.image_filters

    html += `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${escape(page.title)}</title>
          <link rel="stylesheet" href="https://d2v52k3cl9vedd.cloudfront.net/basscss/7.0.4/basscss.min.css">
          <style>
            .btn-link:hover { text-decoration: underline; }
            h1,h2,h3,h4,h5,h6,p,ul,ol,blockquote { max-width: 950px; }
            .white a { color: white; text-decoration: underline; }
            .black a { color: black; text-decoration: underline; }
          </style>
        </head>
      <body>`;

    html += `\n<header class="p1">`;
    html += Nav(page.navigation, page.path);
    html += `</header>`;

    page.items.forEach(item => {
      let sectionColors = calcSectionColors(item);
      html += `\n<section class="p2 ${sectionColors.class}" style="${sectionColors.style}">`;
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
