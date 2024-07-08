const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');  // Make sure this line is included

const app = express();
const port = 3000;

const uri = "mongodb+srv://eurekajade27:eurekajade27@cluster0.xisghdv.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));


// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

// Connect to the MongoDB database
async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database = client.db('reservationDB');
    const reservations = database.collection('reservations');

  

    // Define the form route
    app.post('/submit', async (req, res) => {
      const formData = {
        name: req.body.name,
        phone: req.body.phone,
        person: req.body.person,
        reservation_date: req.body['reservation-date'],
        timeRes: req.body.timeRes,
        message: req.body.message
      };

      try {
        const result = await reservations.insertOne(formData);
        console.log(`New reservation created with the following id: ${result.insertedId}`);
        res.send('Reservation successful!');
      } catch (err) {
        console.error('Error inserting reservation:', err);
        res.status(500).send('Error creating reservation.');
      }
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
    // Do not close the client here as we want it to remain open for handling requests
    // await client.close();
  }
}

run().catch(console.dir);
