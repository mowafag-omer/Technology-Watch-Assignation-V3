  
const express = require('express')
// const { Router } = require('express')
var MongoClient = require('mongodb').MongoClient;
const app = express()

app.use (express.json())
app.use(express.urlencoded({ extended: true }))

async function group(){
  const client = new MongoClient("mongodb://localhost:27017", { useUnifiedTopology: true })
  try {
    await client.connect()
    const dbo = client.db('assignator')
    const students = await dbo.collection('student')
    const group = await  dbo.collection('group')

    app.get('/getstudents', async (req, res) => {
      var data = await students.find().toArray()
      res.send(data)
    })
    .post('/addstudents', (req,res) => {
      students.insertOne(req.body)
      res.send()
    })

  } catch(err) {
    console.log(err)
  }
}
group()

// ------------ routes STUDENTS --------------------------->


app.delete('/deletestudents', async (req,res) => {
    await students.deleteMany()
    res.send()
})

// ------------------------ routes GROUP --------------------->
app.get('/getgroup', async function(req,res) {
 var data = await group.find().toArray()
 res.send(data)

});

app.post('/addgroup', async function(req,res) {
    group.inserOne(req.body)
    res.send()
})

app.delete('/deletegroup', async function(req,res){
    await group.deleteMany()
    res.send()
})

app.listen(3001);
