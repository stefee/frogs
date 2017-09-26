var html = require('choo/html')
var css = require('sheetify')

var title = 'BAD FROG'

var error500 = css`
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
    <body class="bg-black-90 white serif">
      <h1 class="${error500} f-2 i tc">somethin went wrong!!<br><a href="/">go home</a></h1>
    </body>
  `
}
