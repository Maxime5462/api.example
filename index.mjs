import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


mongoose.connect('mongodb://localhost/api-example', {
    useCreateIndex: true,
    useNewUrlParser:true
})

const db = mongoose.connection;
db.on('error',console.log);
db.once('open',() => {
    console.log('mongodb is connected')
});

const userSchema = new mongoose.Schema({
    name:String,
    email:{
        unique: true,
        type: String,
    },
    password: String
})

const user = mongoose.model('user', userSchema);


const app = express()

app.use(cors({
    origin: '*'
}))

app.use(bodyParser.json())

app.post('/user', async (req,res) =>{
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name

    const hash = bcryptjs.hashSync(password, 8)

    const response = new user({
        email,
        password: hash,
        name
    })
    try {
        const data = (await response.save()).toObject()
        delete data.password
        res.json(data)
    } catch (e) {
        res.status(401)
        res.json({
            error: e.errmsg
        })
    }


    console.log(hash)
})
app.post('/login', async (req,res)=>{
    const email = req.body.email
    const password = req.body.password

    const data = await user.findOne({
        email
    })
    if (bcrypt.compareSync(password, data.password)){

    } else {

    }
    console.log(data)
})

app.get('*',(req,res)=>{
    res.status(404)
    res.send("The requested URL was not found on the server")
})

app.listen(3000, () => {
    console.log('Server run at http://localhost:3000')
})
