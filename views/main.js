var html = require('choo/html')
var path = require('path')
var fs = require('fs')

var title = 'F R O G S'

module.exports = view

function view (state, emit) {
  if (state.title !== title) emit(state.events.DOMTITLECHANGE, title)

  if (!state.frog.current && !state.params.hash) {
    state.frog.current = {
      hash: 'vVsjW9D',
      ext: '.png',
      is_album: false
    }
  }

  var image
  if (state.frog.current) {
    image = html`<img class="img mv4 center db" alt="random frog picture" src="${getImageURL(state.frog.current)}">`
    image.addEventListener('load', onload, false)
    image.addEventListener('error', onload, false)
    image.addEventListener('abort', onload, false)
  } else {
    image = html`<div class="mv5 f5 i tc">frugs...?</div>`
    emit('frog:get', state.params.hash)
  }

  return html`
    <body class="bg-black-90 white serif">
      <h1 class="f1 i tc">F R O G S</h1>
      <div class="pointer" onclick=${onclick}>
        ${state.boy.el}
        <div class="f3 i tc">click me!</div>
        ${image}
      </div>
      <p class="f5 i tc mt5 mb6">${fs.readFileSync(path.join(__dirname, '../assets/madefor.txt'), 'utf8')}</p>
    </body>
  `

  function onclick () {
    emit('frog:random')
  }

  function onload () {
    emit('frog:load')
  }
}

function getImageURL (imageData) {
  return 'https://imgur.com/' + (imageData.is_album ? imageData.album_cover : imageData.hash) + (imageData.ext.replace(/\?.*/, ''))
}
