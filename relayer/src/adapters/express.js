const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.EA_PORT || 8080
const cors = require('cors')

app.use(cors());

function init (createRequest) {
  return () => {
    app.use(bodyParser.json({ limit: '20mb' }))
    app.use(bodyParser.text({ limit: '20mb' }));

    app.post('/', (req, res) => {
      //console.log('POST Data: ', req.body)
      createRequest(req.body, (status, result) => {
        console.log('Result: ', result)
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
