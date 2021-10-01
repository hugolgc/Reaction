const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)
let players = []

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/master.html')
})

io.on('connection', socket => {

  socket.emit('connection', socket.id)

  socket.on('setUser', name => {
    if (!players.find(player => player.name === name)) players.push({ name: name, id: socket.id, time: 'DNF' })
    else players.find(player => player.name === name).id = socket.id
    io.emit('setRanking', players)
  })

  socket.on('newTime', newTime => {
    if (players.find(player => player.id === socket.id).time === 'DNF' || players.find(player => player.id === socket.id).time > newTime) {
      players.find(player => player.id === socket.id).time = newTime
      io.emit('setRanking', players)
      console.log('setRanking', newTime)
    }
  })
})

server.listen(process.env.PORT || 3000)