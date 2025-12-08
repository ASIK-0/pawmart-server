const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
require("dotenv").config();
app.use(cors());
app.use(express.json())

console.log(process.env.DB_UAERNAME)

const uri = `mongodb+srv://${process.env.DB_UAERNAME}:${process.env.DB_PASSWORD}@aplication1.govvz0x.mongodb.net/?appName=aplication1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();

        // database
        const db = client.db('pawmart-db')
        const productCollection = db.collection('products')
        const orderCollections = db.collection('orders')

        // find
        app.get('/products', async (req, res) => {
            const result = await productCollection.find().toArray()
            res.send(result)
        })
        // findOne
        app.get('/products/:id', async (req, res) => {
            const { id } = req.params
            const objectId = new ObjectId(id)
            const result = await productCollection.findOne({ _id: objectId })
            res.send({
                success: true,
                result
            })
        })

        // post method
        app.post('/products', async (req, res) => {
            const data = await productCollection.insertOne(req.body)
            console.log(req.body)
            res.send({
                success: true,
                data
            })
        })

        // category filtered product find
        app.get('/category-products/:category', async (req, res) => {
            const category = req.params.category;
            const result = await productCollection.find({ category }).toArray();
            res.send(result);
        });


        // latest 6 data find (get)
        app.get('/latest-products', async (req, res) => {
            const result = await productCollection.find().sort({ date: -1 }).limit(6).toArray()
            res.send(result)
        });

        // MyListing data get
        app.get('/my-listings', async (req, res) => {
            const { email } = req.query
            const query = { email: email }
            const result = await productCollection.find(query).toArray()
            res.send(result)
        })

        // update Listing (put method)
        app.put('/update/:id', async (req, res) => {
            const data = req.body;
            const id = req.params
            const query = { _id: new ObjectId(id) }

            const updateListings = {
                $set: data
            }
            const result = await productCollection.updateOne(query, updateListings)
            res.send(result)
        })

        // delete listing
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })

        // oders post
        app.post('/orders', async (req, res) => {
            const data = req.body
            console.log(data)
            const result = await orderCollections.insertOne(data)
            res.send(result)
        })

        // orders get
        app.get('/orders', async (req, res) => {
            const { email } = req.query;
            const query = { email: email }
            const result = await orderCollections.find(query).toArray();
            res.send(result)
        })



        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Pawmart server is running on port: ${port}`)
})