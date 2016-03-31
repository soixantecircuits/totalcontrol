var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var exphbs = require('express-handlebars')
var _ = require('lodash')

var activeSocket = [
  {
    name: 'test',
    commands: [
      {
        name: 'start-photoshop'
      },
      {
        name: 'shutdown'
      }
    ]
  }
]

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(require('express').static('public'))

app.get('/', function(req, res) {
  res.render('home')
})

app.get('/home', function(req, res) {
  res.render('home')
})

app.get('/command', function(req, res) {
  res.render('command', {
    sockets: activeSocket
  })
})

app.get('/exec/:name/:command', function(req, res) {
  console.log('req.params.id: ', req.params.name)
  console.log('req.params.command: ', req.params.command)
  var remote = _.find(activeSocket, ['name', req.params.name])
  if (remote) {
    remote.socket.emit(req.params.command)
  }
  res.end()
})

io.on('connection', function(socket) {
  socket.emit('news', { hello: 'world' })
  socket.on('registerCommands', function(data) {
    if (checkIntegretity(data)) {
      data.socket = socket
      updateActiveSocket(data)
    }
  })
})

function checkIntegretity(data) {
  if (data.name !== '') {
    return true
  } else {
    return false
  }
}

function updateActiveSocket(data) {
  var index = _.findIndex(activeSocket, { 'name': data.name })
  if (index > 0) {
    activeSocket[index] = data
  } else {
    activeSocket.push(data)
  }
}

server.listen(8080)
