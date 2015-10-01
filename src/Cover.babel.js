import React from 'react';
import imgflo from 'imgflo-url';

const sizes = [
  {maxWidth: 360, maxHeight: 360},
  {maxWidth: 640, maxHeight: 480},
  {maxWidth: 1280, maxHeight: 720}
];

// All generated sources
let sourceCache = [];
export function getAllImageSources () { return sourceCache; }

function sizeByMax (cover, max=sizes[0]) {
  let {width, height} = cover;
  let {maxWidth, maxHeight} = max;
  if (!width || !height) {
    return {width: maxWidth};
  }
  if (width <= maxWidth && height <= maxHeight) {
    return {width, height};
  }
  let ratio = width/height;
  let maxRatio = maxWidth/maxHeight;
  if (ratio >= maxRatio) {
    let scale = maxWidth / width;
    width = Math.round( width * scale );
    height = Math.round( height * scale );
    return {width, height};
  } else {
    let scale = maxHeight / height;
    width = Math.round( width * scale );
    height = Math.round( height * scale );
    return {width, height};
  }
}

function sizeAndProxyImage (cover, imgfloConfig, max) {
  let {src, width, height} = cover;
  let imgfloParams = sizeByMax(cover, max);
  imgfloParams.input = src;
  return {
    src: imgflo(imgfloConfig, 'passthrough', imgfloParams),
    width: imgfloParams.width,
    height: imgfloParams.height
  }
}

export default class Cover extends React.Component {
  render() {
    let {metadata, cover, imgfloConfig} = this.props;
    let {isBasedOnUrl, url, caption, title} = metadata;
    let alt = caption || title;
    let permalink = url || isBasedOnUrl;

    let lastSrc;
    let sources = [];
    let srcset = [];
    sizes.forEach( size => {
      let {src, width} = sizeAndProxyImage(cover, imgfloConfig, size);
      if (src !== lastSrc) {
        sources.push(src);
        srcset.push(`${src} ${width}w`);
      }
      lastSrc = src;
      return src;
    });

    sourceCache = sourceCache.concat(sources);

    let imgProps = {};
    if (srcset.length > 1) {
      imgProps.srcSet = srcset.join(', ');
      imgProps.sizes = '(min-width: 40em) 80vw, 100vw';
    }
    let img = <img alt={alt} src={sources[0]} {...imgProps} />;

    if (permalink)
      return <a href={permalink}>{img}</a>;
    else
      return img;
  }
}
