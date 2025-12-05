const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        app.get('/my-listings',async (req, res) => {

            const { email } = req.query
            const query = { email: email }
            const result = await productCollection.find(query).toArray()
            res.send(result)
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