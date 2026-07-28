// =============================================================================
// EECE/CS 3093C Software Engineering — Lab 4
// server.js — code skeleton provided by Phu Phung
// complete implementation by [Your Name]
// =============================================================================
const express    = require('express');
const app    = express();
const { MongoClient } = require('mongodb');
app.use (express.urlencoded({extended: false}))
const cors = require('cors')//New for microservice
app.use(cors())//New for microservice
const uri = process.env.MONGODB_URI || "mongodb+srv://braden:Pass123@messengerdb.8udn39s.mongodb.net/?appName=MessengerDB";
const mongoclient = new MongoClient(uri);
async function mongoconnect (){
  await mongoclient.connect();
  console.log('Debug> connected to MongoDB server!');
}
const PORT = process.env.PORT || 8080;
(async () => {
  try {
    await mongoconnect();
    app.listen(PORT, () => 
      console.log('Server running on port ' + PORT));
  } catch (err) {
    console.log('Error>server.js: failed to start — database connection error', err);
    process.exit(1); // fail fast — don't run a server that can't authenticate anyone
  }
})();
app.get('/', (req, res) => {
  res.send('USCities-Microservices Gateway by Braden Preston');
})

app.get('/echo/:input', function (req, res) {
  var input = req.params.input;
  res.send(input);
});