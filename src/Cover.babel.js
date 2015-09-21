import React from 'react';
import imgflo from 'imgflo-url';

const MAX_WIDTH = 1280;
// const MAX_HEIGHT = 720;

function sizeByWidth (cover) {
  let {width, height} = cover;
  if (!width || !height) {
    return {width: MAX_WIDTH};
  } else if (width <= MAX_WIDTH) {
    return {width: width, height: height};
  } else {
    let scale = MAX_WIDTH/width
    return {
      width: Math.round(width*scale),
      height: Math.round(height*scale)
    }
  }
}

function sizeAndProxyImage (cover, imgfloConfig) {
  let {src, width, height} = cover;
  let imgfloParams = sizeByWidth(cover);
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
    let {src} = sizeAndProxyImage(cover, imgfloConfig);
    let {isBasedOnUrl, caption, title} = metadata;
    let alt = caption || title;

    let img = <img alt={alt} src={src} />;

    if (isBasedOnUrl)
      return <a href={isBasedOnUrl}>{img}</a>;
    else
      return img;
  }
}
