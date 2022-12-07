const express = require("express")

require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const app = express()
app.use(express.json())
const users = []

app.get("/", (req, res) => {
    res.send("hello")
})

app.post("/users/sign-up", (req, res) => {

    const { email, name, password } = req.body
    // harshedPassword = bcrypt.hash(password, saltRounds, function (err, hash) {
    //     // Store hash in your password DB.
    // });

    const userId = users.length + 1

    const newUser = {
        id: userId,
        email: email,
        password: password,
        name: name
    }
    users.push(newUser)
    const payload = {
        user: {
            id: userId
        }
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" })
    res.send({ jwtToken: token, isAuthenticated: true })
})

app.get('/quotes', (req, res) => {

    const bearerToken = req.header("authorization")

    const token = bearerToken.split(" ")[1]
    try {
        const verify = jwt.verify(token, process.env.SECRET_KEY)
        console.log(verify.user)
        res.send("Got your token.")

    } catch {
        res.status(403).send("Invalid token")
    }

})

app.post('/users/sign-in', async (req, res) => {

    const { email, password } = req.body
    try {
        const user = await users.filter(user => user.email === email)

        if (user.length === 0) {
            return res.status(401).json({ error: "Invalid Credential", isAuthenticated: false })
        }
        const isValidPassword = await bcrypt.compare(password, user[0].password)
        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid Credential", isAuthenticated: false })
        }

        const jwtToken = generateJWT(user[0].id)
        return res.status(200).send({ jwtToken, isAuthenticated: true })
    } catch (error) {
        console.error(error.message)
        res.status(500).send({ error: error.message })
    }




    res.send('WIP')
})
const port = process.env.PORT

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})