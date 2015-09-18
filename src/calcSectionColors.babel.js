import Color from 'color';

export default function (item) {
  if (!item || !item.content || !item.content.length)
    return '';

  let block = item.content.find(block => {
    return (block.cover && block.cover.colors && block.cover.colors.length)
  });

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
