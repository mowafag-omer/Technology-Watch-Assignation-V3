  
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const { ObjectID, ObjectId } = require('bson');
const app = express()

app.use (express.json())
app.use(express.urlencoded({ extended: true }))

async function group(){
  const client = new MongoClient("mongodb://localhost:27017", { useUnifiedTopology: true })
  try {
    await client.connect()
    const dbo = client.db('assignator')
    const students = await dbo.collection('student')
    const techWatch = await dbo.collection('techWatch')

    // ------------ routes STUDENTS --------------------------->

    app.get('/getstudents', async (req, res) => {
      var data = await students.find().toArray()
      res.send(data)
    })
    .post('/addstudents', (req,res) => {
      students.insertOne(req.body)
      res.send()
    })
    .delete('/deleteStudents', async (req,res) => {
      await students.deleteOne({_id: ObjectId(req.body.dname)})
      res.send()
    })
    .put('/updateStudents', async (req,res) => {
      if(req.body.reset == false){
        for(const obj in req.body.objects){
          await students.updateOne({_id: ObjectId(req.body.objects[obj])}, {$set: {selected: true}})
        }
      } else {
        await students.updateMany({}, {$set: {selected: false}})
      }  
      res.send()
    })
    // ------------------------ routes techWatch --------------------->
    .get('/getgroup', async function(req,res) {
    var data = await techWatch.find().toArray()
    res.send(data)

    })
    .post('/addTechWatch', async function(req,res) {
      techWatch.insertOne(req.body)
      res.send()
    })
    .delete('/deletetechWatch', async function(req,res){
        await techWatch.deleteMany()
        res.send()
    })
    
  } catch(err) {
    console.log(err)
  }
}
group()

app.listen(3001);
