const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.isyks.mongodb.net/lockStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const productsCollection = client.db("lockStore").collection("products");
    const ordersCollection = client.db("lockStore").collection("orders");


    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount)
            })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.delete('/delete/:id', (req, res) =>{
        productsCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then( result => {
          res.send(result.deletedCount > 0);
        })
      })

    app.get('/', (req, res) => {
        res.send("It's Working")
    })
});


app.listen(port);