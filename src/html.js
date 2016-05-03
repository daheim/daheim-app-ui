import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom/server'
import Helmet from 'react-helmet'

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object
  }

  render () {
    const {assets, component} = this.props
    const content = component ? ReactDOM.renderToString(component) : ''
    const head = Helmet.rewind()

    return (
      <html is lang='en-us' ng-app='dhm' ng-controller='SiteCtrl'>
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}

          <link rel='apple-touch-icon' sizes='57x57' href='/apple-icon-57x57.png'/>
          <link rel='apple-touch-icon' sizes='60x60' href='/apple-icon-60x60.png'/>
          <link rel='apple-touch-icon' sizes='72x72' href='/apple-icon-72x72.png'/>
          <link rel='apple-touch-icon' sizes='76x76' href='/apple-icon-76x76.png'/>
          <link rel='apple-touch-icon' sizes='114x114' href='/apple-icon-114x114.png'/>
          <link rel='apple-touch-icon' sizes='120x120' href='/apple-icon-120x120.png'/>
          <link rel='apple-touch-icon' sizes='144x144' href='/apple-icon-144x144.png'/>
          <link rel='apple-touch-icon' sizes='152x152' href='/apple-icon-152x152.png'/>
          <link rel='apple-touch-icon' sizes='180x180' href='/apple-icon-180x180.png'/>
          <link rel='icon' type='image/png' sizes='192x192' href='/android-icon-192x192.png'/>
          <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png'/>
          <link rel='icon' type='image/png' sizes='96x96' href='/favicon-96x96.png'/>
          <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png'/>
          <link rel='manifest' href='/manifest.json'/>
          <meta name='msapplication-TileColor' content='#ffffff'/>
          <meta name='msapplication-TileImage' content='/ms-icon-144x144.png'/>
          <meta name='theme-color' content='#ffffff'/>

          <meta name='viewport' content='width=device-width, initial-scale=1' />
          {/* styles (will be present only in production with webpack extract text plugin) */}
          {Object.keys(assets.styles).map((style, key) =>
            <link href={assets.styles[style]} key={key} media='screen, projection'
              rel='stylesheet' type='text/css' charSet='UTF-8'/>
          )}

          {/* (will be present only in development mode) */}
          {/* outputs a <style/> tag with all bootstrap styles + App.scss + it could be CurrentPage.scss. */}
          {/* can smoothen the initial style flash (flicker) on page load in development mode. */}
          {/* ideally one could also include here the style for the current page (Home.scss, About.scss, etc) */}
          {Object.keys(assets.styles).length === 0 && false ? <style dangerouslySetInnerHTML={{__html: require('../theme/bootstrap.config.js') + require('../containers/App/App.scss')._style}}/> : null}
        </head>
        <body>
          <div id='content' dangerouslySetInnerHTML={{__html: content}}/>
          <script dangerouslySetInnerHTML={{__html: `
            WebFontConfig = {
              google: { families: [ 'Open+Sans:400,300,400italic,700,800:latin,latin-ext', 'Roboto:400,300,300italic,400italic,700,900:latin,latin-ext', 'Lato:400,700,900:latin,latin-ext', 'Raleway:400,300,300italic,400italic,700,900:latin,latin-ext', 'Oswald:400,700:latin,latin-ext' ] }
            };
            (function() {
              var wf = document.createElement('script');
              wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
              wf.type = 'text/javascript';
              wf.async = 'true';
              var s = document.getElementsByTagName('script')[0];
              s.parentNode.insertBefore(wf, s);
            })(); </script>
          `}}></script>
          <script dangerouslySetInnerHTML={{__html: `window.__INIT=${JSON.stringify({API_URL: 'http://localhost:8080/api'})}`}} charSet='UTF-8'/>
          <script src={assets.javascript.main} charSet='UTF-8'/>
        </body>
      </html>
    )
  }
}

// <script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(store.getState())}`}} charSet='UTF-8'/>
