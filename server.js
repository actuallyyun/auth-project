const express = require("express")

const app = express()

app.get("/", (req, res) => {
    res.send("hello")
})

require('dotenv').config()
const port = process.env.PORT

app.listen(5000, () => {
    console.log(`server is running at ${port}`)
})