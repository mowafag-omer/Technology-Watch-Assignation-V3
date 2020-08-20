const express = require('express')
const fetch = require('node-fetch')
const app = express()

app.use (express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine','ejs')
app.use(express.static('./public'))

let studentsData, groupsData;

app.post('/addStudent', async (req, res) => {
  console.log(req.body)
  await fetch('http://localhost:3001/addstudents', {
    method: 'post',
    body: JSON.stringify(req.body),
    headers :{'Content-type': 'application/json'}
  })
  res.redirect('/students')
})

.post('/deleteStudent', async (req, res) => {
  console.log(req.body)
  // await fetch('http://localhost:3000/addstudents' ,{
  //   method: 'delete',
  //   body: JSON.stringify(req.body),
  //   headers :{'Content-type': 'application/json'}
  // })
  res.redirect('/students')
})

.post('/createGroupe', async (req, res) => {
  console.log(req.body)

  // const names = [...students].map(elm => elm.name)
  // const members = req.body.mmbr
  // const grparr = []
  
  // if(names.length >= members){
  //   for(let i=0; i < members; i++){
  //     const random = names[Math.floor(Math.random() * names.length)]
  //     grparr.push(random)
  //     names.splice(names.indexOf(random), 1)
  //   }  
  // } else {
  //   grparr = [...names]
  // }

  // await fetch('http://localhost:3000/addstudents' ,{
  //   method: 'post',
  //   body: JSON.stringify(req.body),
  //   headers :{'Content-type': 'application/json'}
  // })
  res.redirect('/assignation')
})

/*---------------pages rendering-------------------------*/

app.get('/', async (req, res) => {
  const fetchedStdn = await fetch('http://localhost:3001/getstudents')
  const studentsData = await fetchedStdn.json()
  res.render('pages/index', {data: studentsData, title: 'home'})
})
.get('/students', async (req, res) => {
  console.log(studentsData)
  res.render('pages/students', {data: studentsData, title: 'students'})
})
.get('/assignation', (req, res) => {
  res.render('pages/assignation', {title: 'assignation'})
})
.get('/history', (req, res) => {
  res.render('pages/history', {title: 'history'})
})

app.listen(8080)