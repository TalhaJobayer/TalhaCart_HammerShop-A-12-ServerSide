const express = require('express')
const app = express()
const cors = require('cors')
const port =process.env.PORT || 5000
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
      app.get('/products', async (req,res)=>{
       const query = { };
        const cursor =  HammerCollection.find(query);
        const result=await cursor.toArray();
        res.send(result)
      })
  // api call end
  app.get('/products/:id', async(req,res)=>{
    const id=req.params.id
     const query={_id:ObjectId(id)};
   
     const result= await HammerCollection.findOne(query)
     
     res.send(result)
  })


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