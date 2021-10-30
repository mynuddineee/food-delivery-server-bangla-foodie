const express = require('express');
const { MongoClient } = require('mongodb');
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
        console.log('connection established to db');
        const database = client.db("online-food");
        const foodsCollection = database.collection("foods");

        // get data from db
        app.get('/foods', async(req,res) => {

            const cursor = foodsCollection.find({});
            const foods = await cursor.toArray();
            res.send(foods);
        })

    }

    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {

    res.send('connection with server')
})

app.listen(port, () =>{

    console.log('listening on port', port);
})