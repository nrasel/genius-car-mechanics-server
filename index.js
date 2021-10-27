const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 5000
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('genius car mechanics')
})

// naimur

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gzjd3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("geniusCar");
        const mechanicsCollection = database.collection("mechanics");
        // post api
        app.post('/services', async (req, res) => {
            const service = req.body
            const result = await mechanicsCollection.insertOne(service)
            console.log('hittin service', service)
            res.json(result)
        })

        // get api
        app.get('/services', async (req, res) => {
            const cursor = mechanicsCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })

        // get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await mechanicsCollection.findOne(query)
            res.json(service)
        })

        // delete api
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await mechanicsCollection.deleteOne(query)
            res.json(result)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, (req, res) => {
    console.log('server running port', port);
})