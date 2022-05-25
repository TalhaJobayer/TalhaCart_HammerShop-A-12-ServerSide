const express = require('express')
const app = express()
const cors = require('cors')
const jwt=require('jsonwebtoken')
const port =process.env.PORT || 5000
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const sign = require('jsonwebtoken/sign')

// middleWare=====
app.use(cors())
app.use(express.json())
// middleWare=====


// =======================================


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.z4bsa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
      await client.connect();
      const HammerCollection = client.db("hammerCollection").collection("hammer");
      const userCollection = client.db("hammerCollection").collection("user");
      const orderCollection = client.db("hammerCollection").collection("Order");
      app.get('/products', async (req,res)=>{
       const query = { };
        const cursor =  HammerCollection.find(query);
        const result=await cursor.toArray();
        res.send(result)
      })
      // for single product api
      app.get('/products/:id', async(req,res)=>{
        const id=req.params.id
         const query={_id:ObjectId(id)};
       
         const result= await HammerCollection.findOne(query)
         
         res.send(result)
      })
      
  // api call end===================================
  // crud Oparetion===========
// post===============
app.post('/products', async(req,res)=>{
    const  newProduct=req.body
      const   result=await HammerCollection.insertOne(newProduct)
         res.send(result)
    })
// post===============
// ordered product=================
app.post('/orderProducts', async(req,res)=>{
  const  newProduct=req.body
  
    const   result=await orderCollection.insertOne(newProduct)
       res.send(result)
  })
  // order product api====
  app.get('/orderProducts', async (req,res)=>{
   
    const query = { };
     const cursor =  orderCollection.find(query);
     const result=await cursor.toArray();
     res.send(result)
   })
  // order product api====
  //specific order product api====
  app.get('/orderProductss', async (req,res)=>{
    const email=req.query.email
    console.log(email);
    const query = {email:email };
     const cursor =  orderCollection.find(query);
     const result=await cursor.toArray();
    
     res.send(result)
   })
  // specific order product api====
// ordered product=================
// put user===============

app.put('/user/:email',async(req,res)=>{
      const email=req.params.email
      const user=req.body
      const filter = { email: email };
   
    const options = { upsert: true };
    const updateDoc = {
      $set:user,
    };
    const result = await userCollection.updateOne(filter, updateDoc, options);
    const token=jwt.sign({email:email}, process.env.ACCES_TOKEN,{expiresIn:'1h'})
    res.send({ result, token });
})
// put user===============



  // crud Oparetion===========
  
 


    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

// =======================================

app.get('/', (req, res) => {
  res.send('ohh talha well done.doing great.keep it up')
})

app.listen(port, () => {
  console.log(`server is on the way.and so are you ${port}`)
})