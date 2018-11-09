const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3000
app.use('/assets', express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'pages') + `/index.html`)
)
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
