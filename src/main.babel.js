const line = "\n";
const ind = '  ';

function removeLast (str, search) {
  var split = str.split('/');
  if (split[split.length-1] === 'index.html') {
    split[split.length-1] = '';
    str = split.join('/')
  }
  return str;
}

// Just wrap each item in a section, and output the HTML as provided by API
export default function (page, options, callback) {

  var html = "<!doctype html>\n<html><head>"
  html += line + "<meta charset=\"utf-8\">";
  html += line + "<title>"+page.title+"</title>";
  html += line + ind + '<link rel="stylesheet" href="https://d2v52k3cl9vedd.cloudfront.net/basscss/7.0.4/basscss.min.css">';
  html += line + "</head><body>";

  // html += "<!-- debug:\n" + JSON.stringify(page, null, 2) + "\n-->";

  html += line + "<header>" + line + "<nav>";
  page.navigation.forEach(nav => {
    var link = page.siteUrl + nav.href;
    link = removeLast(link, 'index.html');
    html += line + ind + '<a href="'+link+'" class="btn py2">'+nav.title+'</a>';
  });
  html += line + "</nav>" + line + "</header>";

  page.items.forEach(item => {
    html += line+ind+"<section>";
    item.content.forEach(block => {
      html += line+ind+ind+block.html;
    });
    html += line+ind+"</section>";
  });

  html += line+"</body></html>";
  var err = null;
  var details = {};
  return callback(err, html, details);

};
