import express from 'express'
import mongoose from 'mongoose';
import { compare, genSalt, hash } from 'bcrypt'
import dotenv from 'dotenv';
import userModel from './model.js';
import jsonwebtoken from 'jsonwebtoken'
import authMiddleware from './authmiddleware.js';

const app = express()
app.use(express.json());
dotenv.config()
const salt = await genSalt();

mongoose.connect(process.env.URI)

app.get('/', (req, res) => {
    res.send('This is homepage')
})

app.get('/users', async (req, res) => {
    const allData = await userModel.find()
    res.send(allData)
})

app.post('/sign-up', async (req, res) => {
    const newUser = req.body;
    const createdData = await userModel.create({
        username: newUser.username,
        password: await hash(newUser.password, salt),
        email: newUser.email
    })
    res.send(createdData)
})

app.post('/sign-in', async (req, res) => {
    const loginDataByUser = req.body;
    const checkUser = await userModel.findOne({ username: loginDataByUser.username });
    if (checkUser) {
        const passwordRight = await compare(loginDataByUser.password, checkUser.password);
        if (passwordRight) {
            const token = jsonwebtoken.sign({ username: checkUser.username, email: checkUser.email }, 'secret')
            res.send({ username: checkUser.username, token })
        }
    }
})

app.get('/profile', authMiddleware, async (req, res) => {
    res.send(req.user)
})

app.listen(process.env.PORT, () => {
    console.log('Server is up')
})