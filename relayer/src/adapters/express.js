const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const pino = require('pino-http')

app.use(cors());
app.use(pino({autoLogging: false}))

function init (createRequest, port) {
  return () => {
    app.use(bodyParser.json({ limit: '20mb' }))
    app.use(bodyParser.text({ limit: '20mb' }));

    app.post('/', (req, res) => {
      //console.log('POST Data: ', req.body)
      createRequest(req.body, (status, result) => {
        //console.log('Result: ', result)
        req.log.info(`operation: ${req.body.operation} status:${status}`)
        res.status(status).json(result)
      })
    })

    app.listen(port, () => console.log(`Listening on port ${port}!`))

    process.on('SIGINT', () => {
      process.exit()
    })
  }
}

module.exports = {
  init
}
