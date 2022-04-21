const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nzlhf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

(async () => {
  try {
    await client.connect();
    const serviceCullection = client.db("geniusCar").collection("service");

    // get all data from database
    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = serviceCullection.find(query);
      const service = await cursor.toArray();
      console.log(service);
      res.send(service);
    });

    // get single data from database
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCullection.findOne(query);
      res.send(service);
    });

    // post data to database
    app.post("/service", async (req, res) => {
      const service = req.body;
      const result = await serviceCullection.insertOne(service);
      res.send(result);
    });

    // delete data from data base
    app.delete("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCullection.deleteOne(query);
      res.send(result);
    });

    // all database related work are upper
  } finally {
  }
})();

// test home
app.get("/", (req, res) => {
  res.send("Genius Server is Listening");
});

// server listening
app.listen(port, () => {
  console.log(`Listening Genius car service .... ${port}`);
});
