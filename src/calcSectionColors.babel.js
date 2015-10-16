import Color from 'color';

function calcColorfulness (color) {
  let lumFactor = Math.abs(0.5 - color.luminosity());
  let colorfulness = color.saturation()/100 - lumFactor;
  return colorfulness;
};

export default function (item) {
  if (!item || !item.content || !item.content.length)
    return '';

  let block;
  for (let i=0; i<item.content.length; i++) {
    let content = item.content[i];
    if (content.cover && content.cover.colors && content.cover.colors.length) {
      block = content;
      break;
    }
  }

  if (!block)
    return '';

  // Clone to not mutate :-/
  let colors = block.cover.colors.slice();

  colors = colors.map(color => {
    return Color().rgb(color);
  })
  .sort((a,b) => {
    return calcColorfulness(a) - calcColorfulness(b);
  })
  .reverse();
  let border = colors[0].hslString();
  return {
    style: `border-color: ${border};`
  };
}
