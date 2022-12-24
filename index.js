const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

require('dotenv').config();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('car services server');
});



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.yfc1gbq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const user = async () => {
    try {
        await client.connect();
        const servicesCollection = client.db('services').collection('service');

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const service = await cursor.toArray();
            res.send(service);
        });

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        });

        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await servicesCollection.insertOne(newService);
            res.send(result);
        });

        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {
        // await client.close();
    }
}
user().catch(console.dir);

app.listen(port, () => {
    console.log('listening port is ', port)
});