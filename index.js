var choo = require('choo')
var html = require('choo/html')
var css = require('sheetify')
var animate = require('nanoanimation')
require('web-animations-js')

css('tachyons')

var app = choo()

if (process.env.NODE_ENV === 'development') {
  app.use(require('choo-devtools')())
  app.use(require('choo-log')())
  app.use(require('choo-service-worker/clear')())
}
// app.use(require('choo-service-worker')())

app.use(frog)
app.route('/', require('./views/main'))
app.route('/*', require('./views/404'))

if (!module.parent) app.mount('body')
else module.exports = app

function frog (state, emitter) {
  state.frog = 'https://imgur.com/vVsjW9D.png'
  state.boy = html`<img class="img w3 center db" alt="frog boy" src="/assets/frog.svg">`
  state.spin = animate(state.boy, [
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(360deg)' }
  ], {
    id: 'boy',
    duration: 400,
    iterations: Infinity,
    fill: 'both'
  })
  emitter.on('frog', function (frog, boy) {
    state.frog = frog
    state.spin.play()
    emitter.emit('render')
  })
  emitter.on('frogLoaded', function () {
    state.spin.pause()
  })
}
