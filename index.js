const express = require('express')
require('dotenv').config()
var admin = require("firebase-admin");
const app = express();


const bodyParser =require('body-parser');
const cors = require('cors')
const port = 4000
////////


var serviceAccount = require("./burj-al-18edc-firebase-adminsdk-vf4ik-d4e1b8632e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://burj-al-18edc.firebaseio.com"
});

////////////

app.use(cors());
app.use(bodyParser.json());


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcyjp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const book = client.db("burj-al").collection("booking");

  app.post('/addbooking',(req,res)=>{
      const newbooking = req.body;
      book.insertOne(newbooking)
      .then(result=>{
       res.send(result.insertedCount > 0);

      })
  
  })
////////////49.7 running////////////////////
  app.get('/bookings',(req,res)=>{
    console.log(req.headers.authorization);
const bearer =req.headers.authorization;
    if(bearer && bearer.startsWith('Bearer ')){

const idToken=bearer.split(' ')[1];
console.log({idToken});


admin.auth().verifyIdToken(idToken)
  .then(function(decodedToken) {
    let email0 = decodedToken.email;
    const email2 = req.query.email;
    console.log(email0);
    console.log(email2);
    if(email0 == req.query.email){
      
    book.find({email:req.query.email})
    .toArray((err,doc)=>{
      res.send(doc)
    })

    }
    console.log({uid});
    
  }).catch(function(error) {

    
  });
    }



else{
res.status(401)('UnAuthorized Access')
//kkkk
}

  


  })
  

});




app.listen(process.env.PORT || port)