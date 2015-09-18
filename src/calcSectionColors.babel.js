import Color from 'color';

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
    return a.saturation() - b.saturation();
  })
  .reverse();
  let bg = colors[0].hslString();
  let fg = colors[0].dark() ? 'white' : 'black';
  return `background-color: ${bg}; color: ${fg};`;
}
