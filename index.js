var choo = require('choo')
var css = require('sheetify')

css('tachyons')

var app = choo()

if (process.env.NODE_ENV === 'development') {
  app.use(require('choo-devtools')())
  app.use(require('choo-log')())
  app.use(require('choo-service-worker/clear')())
}
// app.use(require('choo-service-worker')())

app.use(frogStore)
app.route('/', require('./views/main'))
app.route('/*', require('./views/404'))

if (!module.parent) app.mount('body')
else module.exports = app

function frogStore (state, emitter) {
  state.frog = 'https://imgur.com/vVsjW9D.png'
  emitter.on('frog', function (frog) {
    state.frog = frog
    emitter.emit('render')
  })
}
