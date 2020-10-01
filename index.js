
const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.odwvb.mongodb.net/emmajon-e-commerce?retryWrites=true&w=majority`;
const app = express()
const port = 5000
app.use(bodyParser.json());
app.use(cors());


const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emmajon-e-commerce").collection("products");
  const ordersCollection = client.db("emmajon-e-commerce").collection("orders");
  // perform actions on the collection object
  app.post('/addProducts' ,(req , res) => {
    const products = req.body;
    productsCollection.insertOne(products)
    .then(result => {
      console.log(result.insertCount);
      res.send(result.insertedCount)
    })
  })
  app.get('/products' , (req , res) => {
  productsCollection.find({})
  .toArray((err , documents) => {
    res.send(documents)

  })
  })
  app.get('/products/:key' , (req , res) => {
    productsCollection.find({key:req.params.key})
    .toArray((err , documents) => {
      res.send(documents[0])
  
    })
    })
  app.post('/productByKeys', (req , res)=>{
    const productKeys = req.body;
    productsCollection.find({key: { $in:  productKeys }})
    .toArray((err , documents) => {
      res.send(documents)
    })
  })
  app.post('/addOrder' ,(req , res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
      console.log(result)
      res.send(result.insertedCount > 0 )
    })
  }) 

});

app.listen( process.env.PORT || port) 