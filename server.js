const http        = require('http')
const express     = require('express')
const bodyParser  = require('body-parser')
const morgan      = require('morgan')
const cors        = require('cors')
const app         = module.exports = express()
const server      = http.createServer(app)
const port        = parseInt(process.env.PORT || 3000)
const devMode     = process.env.NODE_ENV !== 'production'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan(devMode ? 'dev' : 'combined'))
app.use(cors({origin: true}))

let playersQueue = [{
  id: 1,
  player: 'Test Player 1'
},{
  id: 2,
  player: 'Test Player 2'
}]

app.post('/players/', function(request, response){
  console.log(request.query.player);
  playersQueue.push({id: playersQueue.length + 1, player: request.query.player})
  response.json({
    success: true,
    message: 'ALERT: MISSILE ADDED!'
  })
})

app.get('/players/', function(request, response){
  response.json(playersQueue)
})
// TODO: ADD (MOUNT) YOUR MIDDLEWARE (ROUTES) HERE
// ^^^ Example: app.use('/v1/kitten', require('./routes/kitten'))
// ^^^ Example: app.use('/cats', require('./routes/kitten'))

app.use(notFound)
app.use(errorHandler)

server.listen(port)
  .on('error',     console.error.bind(console))
  .on('listening', console.log.bind(console, 'Listening on ' + port));

function notFound(req, res, next) {
  const url = req.originalUrl
  if (!/favicon\.ico$/.test(url) && !/robots\.txt$/.test(url)) {
    // Don't log less important auto requests
    console.error('[404: Requested file not found] ', url)
  }
  res.status(404).send({error: 'Url not found', status: 404, url})
}

function errorHandler(err, req, res, next) {
  console.error('ERROR', err)
  const stack =  devMode ? err.stack : undefined
  res.status(500).send({error: err.message, stack, url: req.originalUrl})
}
