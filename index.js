const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jfqqz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run(){

    try{

        await client.connect();
        console.log('connection established to on-line food');
        const database = client.db("online-food");
        const foodsCollection = database.collection("foods");
        const ordersCollection = database.collection("orders");

        // get data from db
        app.get('/foods', async(req,res) => {

            const cursor = foodsCollection.find({});
            const foods = await cursor.toArray();
            res.send(foods);
        })

        // get single item from database

        app.get('/foods/:id', async(req,res) => {

            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const orders = await foodsCollection.findOne(query);
            res.json(orders);
        })

        //  add Food API

        app.post('/foods', async(req,res) => {
            const addFood = req.body;
            const results = await foodsCollection.insertOne(addFood );
            console.log(results);
            res.json(results);
        })


        //  add orders API

        app.post('/orders', async(req,res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })

        // get orders API

        app.get('/orders', async(req,res) => {
            //const order = req.body;
            const result = await ordersCollection.find({}).toArray();
            console.log(result);
            res.send(result);
        })


        // Delete foods API

        app.delete('/foods/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const results = await foodsCollection.deleteOne(query);
            res.json(results);
        })

        // delete orders API

        app.delete('/orders/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const results = await ordersCollection.deleteOne(query);
            res.json(results);
        })
    }

    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {

    res.send('connection with database')
})

app.listen(port, () =>{

    console.log('listening on port', port);
})