var html = require('choo/html')
var path = require('path')
var fs = require('fs')
require('setimmediate')
var randomFrog = require('random-frog')

var title = 'F R O G S'

module.exports = view

function view (state, emit) {
  if (state.title !== title) emit(state.events.DOMTITLECHANGE, title)
  if (!state.frog || typeof state.frog !== 'string') state.frog = ''

  var realBoy = html`<img class="img mv4 center db" alt="real frog boy" src="${state.frog}">`
  realBoy.addEventListener('load', function () {
    emit('frogLoaded')
  }, false)

  return html`
    <body class="bg-black-90 white serif">
      <h1 class="f1 i tc">F R O G S</h1>
      <div class="pointer" onclick=${onclick}>
        ${state.boy}
        <div class="f3 i tc">click me!</div>
        ${realBoy}
      </div>
      <p class="f5 i tc mt5 mb6">${fs.readFileSync(path.join(__dirname, '../assets/madefor.txt'), 'utf8')}</p>
    </body>
  `

  function onclick () {
    randomFrog('frogs', null, '/assets/frogs.json').then(frog => emit('frog', frog))
  }
}
