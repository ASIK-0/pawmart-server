const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json())



const uri = "mongodb+srv://pawmart:IOo284CuX4dxEnZr@aplication1.govvz0x.mongodb.net/?appName=aplication1";

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
        await client.connect();

        // database
        const db = client.db('pawmart-db')
        const productCollection = db.collection('products')

        app.get('/products', async (req, res) => {
            const result = await productCollection.find().toArray()
            res.send(result)
        })

        // post method
        app.post('/products', async (req, res) => {
            const data = await productCollection.insertOne(req.body)
            console.log(req.body)

            res.send({
                success: true
            })
        })




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Pawmart server is running on port: ${port}`)
})