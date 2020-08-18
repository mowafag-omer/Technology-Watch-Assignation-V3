const express = require('express')
const { response, Router } = require('express')
const port = 3001
const app = express()
const ejs = require('ejs')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017"


app.get('/', (req, res) => {
    console.log(`URL: ${req.url}`)
    res.send("hello world")

})
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`)
    console.log(`server listening  on port ${server.address().port}`)
})



async function group() {
    const client = new MongoClient(url, { useUnifiedTopology: true })
    try {
        await client.connect()

        var dbo = client.db('watchassignator')
       const students = await dbo.collection('student')
       const group = await  dbo.collection('group')
    } catch(error) {
        console.log(error)
    }
 


}
group()

// ------------ routes STUDENTS --------------------------->
app.get('/getstudents', async function(req, res){
    var trouve = await students.find().toArray()
    res.send(trouve)

    
});
app.post('/addstudents', async function(req,res){
    students.inserOne(req.body)
    res.send()
})
app.delete('/deletestudents', async function(req,res){
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





