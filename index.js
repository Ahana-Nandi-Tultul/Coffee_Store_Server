const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.epxwefd.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeesCollection = client.db("CoffeDB").collection('coffee')

    app.get('/coffee', async(req, res) => {
      const cursor = coffeesCollection.find();
      const coffee = await cursor.toArray();
      res.send(coffee);

    })

    app.get('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeesCollection.findOne(query);
      res.send(result);
    })

    app.put('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const option = { upsert: true};
      const coffee = req.body;
      const updatedCoffee = {
        $set: {
          name: coffee.name,
          quantity: coffee.quantity,
          category: coffee.category,
          details: coffee.details,
          photo: coffee.photo,
          supplier: coffee.supplier,
          taste: coffee.taste,
        }
      }
      const result = await coffeesCollection.updateOne(filter, updatedCoffee, option);
      res.send(result);
    })

    app.post('/coffee', async(req, res) => {
      const coffee = req.body;
      console.log(coffee);
      const result = await coffeesCollection.insertOne(coffee);
      res.send(result);
    })

    app.delete('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)};
      const result = await coffeesCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Coffee making is started');
})

app.listen(port, ()=> {
    console.log('Coffee Store is listening in the port: ', port);
})