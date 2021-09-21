const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')

app.use(cors());
app.use(clientErrorHandler)

function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}

function init (createRequest, port) {
  return () => {
    app.use(bodyParser.json({ limit: '20mb' }))
    app.use(bodyParser.text({ limit: '20mb' }));

    app.post('/', (req, res) => {
      //console.log('POST Data: ', req.body)
      createRequest(req.body, (status, result) => {
        //console.log('Result: ',status, JSON.stringify(result))
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
