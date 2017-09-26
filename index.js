var choo = require('choo')
var html = require('choo/html')
var css = require('sheetify')
var xhr = require('request')
var uniqueRandomArray = require('unique-random-array')
var animate = require('nanoanimation')
require('web-animations-js') // Web Animations polyfill

css('tachyons')

var app = choo()

if (process.env.NODE_ENV === 'development') {
  app.use(require('choo-devtools')())
  app.use(require('choo-log')())
  app.use(require('choo-service-worker/clear')())
}
app.use(require('choo-service-worker')())

app.use(frog)
app.route('/', require('./views/main'))
app.route('/:hash', require('./views/main'))
app.route('/:hash/*', require('./views/404'))

if (!module.parent) app.mount('body')
else module.exports = app

function frog (state, emitter) {
  state.boy = {}
  state.boy.el = html`<img class="img w3 center db" alt="spinny boy" src="/assets/frog.svg">`
  state.boy.anim = animate(state.boy.el, [
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(360deg)' }
  ], {
    id: 'spin',
    duration: 400,
    iterations: Infinity,
    fill: 'both'
  })

  state.frog = {
    current: null,
    data: null,
    getRandom: null
  }

  emitter.on('frog:random', function () {
    state.boy.anim.play()

    if (state.frog.getRandom) {
      state.frog.current = state.frog.getRandom()
      emitter.emit(state.events.PUSHSTATE, '/' + state.frog.current.hash)
    } else {
      getFrogs(function (data) {
        state.frog.data = data
        state.frog.getRandom = uniqueRandomArray(state.frog.data)
        state.frog.current = state.frog.getRandom()
        emitter.emit(state.events.PUSHSTATE, '/' + state.frog.current.hash)
      })
    }
  })

  emitter.on('frog:get', function (hash) {
    if (state.frog.data) {
      findFrog(state.frog.data, hash)
    } else {
      getFrogs(function (data) {
        state.frog.data = data
        findFrog(state.frog.data, hash)
      })
    }

    function findFrog (data, hash) {
      state.frog.current = data.find(el => el.hash === hash)
      if (!state.frog.current) state.frog.notFound = true
      else state.frog.notFound = false
      emitter.emit(state.events.RENDER)
    }
  })

  emitter.on('frog:load', function () {
    state.boy.anim.pause()
  })

  function getFrogs (callback) {
    xhr.get('/assets/frogs.json', { json: true }, function (err, resp, body) {
      if (err) {
        emitter.emit('log:fatal', err)
        state.boy.anim.pause()
        emitter.emit(state.events.PUSHSTATE, '/?fatal=true') // TODO: handle query
        return
      }
      callback(body.data)
    })
  }
}
