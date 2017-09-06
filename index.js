var choo = require('choo')
var html = require('choo/html')
var css = require('sheetify')

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
  var animate = require('nanoanimation')
  require('web-animations-js')

  state.frog = 'https://imgur.com/vVsjW9D.png'
  state.boy = {}
  state.boy.el = html`<img class="img w3 center db" alt="spinny boy" src="/assets/frog.svg">`
  state.boy.anim = animate(state.boy.el, [
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(360deg)' }
  ], {
    id: 'boy',
    duration: 400,
    iterations: Infinity,
    fill: 'both'
  })
  emitter.on('frog:get', function (url) {
    state.frog = url
    state.boy.anim.play()
    emitter.emit('render')
  })
  emitter.on('frog:load', function () {
    state.boy.anim.pause()
  })
}
