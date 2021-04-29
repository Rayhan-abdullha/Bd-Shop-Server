const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config();

const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.exmxz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get("/", (req, res) => {
    res.send('This is server')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("BdShopData").collection("products");

    app.get('/product', (req, res) => {
        collection.find({})
        .toArray((err, items) => {
            res.send(items)

        })
    })

    app.get('/product/:id', (req, res) => {
        collection.find({_id: ObjectId(req.params.id)})
        .toArray((err, document) => {
            res.send(document[0])
        })
    })
    
    app.post('/addEvent', (req, res) => {
        const newEvent = req.body;
        collection.insertOne(newEvent)
        .then(result => {
            console.log('inserted count', result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.delete("/deleted/:id" , (req, res) => {
        collection.deleteOne({_id: ObjectId(req.params.id)})
        .then((err, result) => {
            res.send(result)
        })
    })
});

// person data
client.connect(err => {
    const personCollection = client.db("BdShopData").collection("personShopingData");
    app.post('/addCheckOut', (req, res) => {
        const newCheckOut = req.body;
        personCollection.insertOne(newCheckOut)
        .then(result => {
            res.send(result.insertedCount > 0)
        })      
    })

    app.get("/checkout" , (req, res) => {
        // const perosonEmail = req.query.email
        // const checkoutEmail = loggedInUser.email
        personCollection.find({})
        .toArray((err, document) => {
            res.send(document)
        })
    })

    app.delete("/delete/:id" , (req, res) => {
        personCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.send(result)
        })
    })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});