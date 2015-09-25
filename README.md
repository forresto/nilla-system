# nilla-system
builds a website from https://developer.thegrid.io/ data

# Install

```
npm install
npm install webpack webpack-dev-server -g
```

# Development

`npm start`

Open [http://localhost:8080/preview/](http://localhost:8080/preview/)

# Building

`npm run build`

The design system is built by Travis CI on every push and hosted on the gh-pages
branch at `https://forresto.github.io/nilla-system/nilla.js`

Applying the design system to your own Grid site isn't simple. The
command-line `auth` and `configure-site` scripts in the
[API examples](https://github.com/the-grid/apidocs/tree/master/code-examples/coffeescript)
work.