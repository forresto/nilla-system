// Just wrap each item in a section, and output the HTML as provided by API
// No CSS/styling is performed
window.polySolvePage = function(page, options, callback) {
  var line = "\n";
  var ind = "  ";

  var html = "<!doctype html>\n<html><head><meta charset=\"utf-8\">";
  html += line + ind + '<link rel="stylesheet" href="//d2v52k3cl9vedd.cloudfront.net/basscss/7.0.4/basscss.min.css">';
  html += line + "</head><body>";

  // html += "<!-- debug:\n" + JSON.stringify(page, null, 2) + "\n-->";

  page.items.forEach(function(item) {
    html += line+ind+"<section>";
    item.content.forEach(function(block) {
      html += line+ind+ind+block.html;
    });
    html += line+ind+"</section>"
  });
  html += line+"</body></html>"
  var err = null;
  var details = {};
  return callback(err, html, details);
};
