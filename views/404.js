var html = require('choo/html')
var css = require('sheetify')

var title = '404'

var error404 = css`
  :host {
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    position: absolute;
  }
`

module.exports = view

function view (state, emit) {
  if (state.title !== title) emit(state.events.DOMTITLECHANGE, title)
  return html`
    <body class="bg-black white serif">
      <h1 class="${error404} f-6 i tc">404</h1>
    </body>
  `
}
