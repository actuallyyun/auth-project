const express = require("express")

const app = express()
app.use(express.json())

const user = require("./routes/user")

app.get("/", (req, res) => {
    res.send("hello")
})

app.use("/user", user)


app.listen(5000, () => {
    console.log(`server is running at http://localhost:5000`)
})