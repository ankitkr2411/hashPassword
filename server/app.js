const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')



app.use(cookieParser());
app.use(express.json());

dotenv.config({ path: './config.env' });

const saltRounds = process.env.SALT_ROUNDS;



app.post('/register', async (req, res) => {
    try {


        const body = req.body;
        const salt = await bcrypt.genSalt(Number(saltRounds));

        const hashedPass = await bcrypt.hash(body.password, salt);
        res.cookie("hash", hashedPass);
        return res.status(200).send("Password Hashed Successfully");
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Server Error")
    }

})

app.get('/login', async (req, res) => {

    try {

        const body = req.body;

        const verify = await bcrypt.compare(body.password, req.cookies.hash);

        if (verify) {
            return res.status(200).send("Successfully Logged In");
        }

        return res.status(401).send("Wrong Credentials");

    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Server Error");
    }


})


app.listen(5000, () => {
    console.log("Server Started");
})