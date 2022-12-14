const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9snwll.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productCollection = client.db('emaJohn').collection('products');

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page, size)
            const query = {};
            const cursor = productCollection.find(query);
            const count = await productCollection.estimatedDocumentCount();
            const products = await cursor.skip(page * size).limit(size).toArray();
            res.send({ count, products })
        })

        app.post('/productsById', async (req, res) => {
            const ids = req.body;
            const objectId = ids.map(id => ObjectId(id))
            const query = { _id: { $in: objectId } };
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })
    }
    finally {

    }
}
run().catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send('jfdbnjfbhfffffffff');
})

app.listen(port, () => {
    console.log('running')
})