import { config } from './config';
const cors = require('cors-express');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const options = {
      allow : {
          origin: '*',
          methods: 'GET,PATCH,PUT,POST,DELETE,HEAD,OPTIONS',
          headers: 'Content-Type, Authorization, Content-Length, X-Requested-With, X-HTTP-Method-Override'
      } 
    };
 
app.use(cors(options));
// configure app to use body parser to extract JSON from POST
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());


mongoose.connect(config.dbURI, {
  useMongoClient: true,
});

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + config.dbURI);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

// Import model
const Favorite = require('./models/favorite.js');

// Make static assets available to UI
app.use(express.static(path.join(__dirname, '../client/dist')));

const router = express.Router();
// Serve the UI over express server
router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

//Initialize API
router.get('/api', function(req, res){
  res.send('API initialized');
});

//Register API routes
app.use('/api', router);

// Route for all records in collection
router.route('/favorites')

  // Add a favorite entry to the database
  .post(function(req, res){
    // Create an entry
    const favorite = new Favorite();
    favorite.title = req.body.title,
    favorite.authors = req.body.authors,
    favorite.rating = req.body.rating,
    favorite.publisher = req.body.publisher,
    favorite.publishedDate = req.body.publishedDate,
    description = req.body.description,
    favorite.thumbnail = req.body.thumbnail,
    favorite.price = req.body.price,
    favorite.purchase = req.body.purchase,

    // Save the entry and check for errors
    favorite.save(function(err){
      if(err) {
        res.send(err);
      } else {
        res.json({
          message: 'Favorite added',
          favorite: favorite
        });
      }
    });   
  })
  
  // Retrieve all favorites from the database
    .get(function(req, res){
      Favorite.find(function(err, favorites){
        if(err){
          res.send(err);
        } else {
          res.json(favorites);
        }
      });
    });

// Route for specific records
router.route('/favorites/:id')

    // Remove a record permanently
    .delete(function(req, res) {
        Favorite.remove({_id: req.params.id}, function(err){
          if(err){
            res.send(err);
          } else {
            res.send("Record Removed");
          }
        });
        res.status(204).end();
    });

app.listen(config.port,
  console.log('Listening on port ', config.port));
