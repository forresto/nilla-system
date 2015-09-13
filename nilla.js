// Just wrap each item in a section, and output the HTML as provided by API

var removeLast = function (str, search) {
  var split = str.split('/');
  if (split[split.length-1] === 'index.html') {
    split.pop()
    str = split.join('/')
  }
  return str;
};

window.polySolvePage = function(page, options, callback) {
  var line = "\n";
  var ind = "  ";

  var html = "<!doctype html>\n<html><head><meta charset=\"utf-8\">";
  html += line + ind + '<link rel="stylesheet" href="//d2v52k3cl9vedd.cloudfront.net/basscss/7.0.4/basscss.min.css">';
  html += line + "</head><body>";

  // html += "<!-- debug:\n" + JSON.stringify(page, null, 2) + "\n-->";

  html += line + "<header><nav>";
  page.navigation.forEach(function (nav) {
    var link = page.siteUrl + nav.href;
    link = removeLast(link, 'index.html');
    html += line + ind + '<a href="'+link+'" class="btn py2">'+nav.title+'</a>';
  });
  html += line + "</nav></header>";

  page.items.forEach(function (item) {
    html += line+ind+"<section>";
    item.content.forEach(function (block) {
      html += line+ind+ind+block.html;
    });
    html += line+ind+"</section>"
  });
  html += line+"</body></html>"
  var err = null;
  var details = {};
  return callback(err, html, details);
};
