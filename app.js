const express = require('express')
const fetch = require('node-fetch')
const app = express()

app.use (express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine','ejs')
app.use(express.static('./public'))

const studentsData = async () => {
  const fetchedStdn = await fetch('http://localhost:3001/getstudents')
  return await fetchedStdn.json()
}

const updateStudent = async (obj, rst) => {
  await fetch('http://localhost:3001/updateStudents', {
    method: 'put',
    body: JSON.stringify({objects: obj, reset: rst}),
    headers :{'Content-type': 'application/json'}
  })
}

app.post('/addStudent', async (req, res) => {
  await fetch('http://localhost:3001/addstudents', {
    method: 'post',
    body: JSON.stringify({name: req.body.name, selected: false}),
    headers :{'Content-type': 'application/json'}
  })
  res.redirect('/students')
})
.post('/rs', async (req, res) => {
  await fetch('http://localhost:3001/deleteStudents' ,{
    method: 'delete',
    body: JSON.stringify(req.body),
    headers :{'Content-type': 'application/json'}
  })
  res.redirect('/students')
})
.post('/createGroupe', async (req, res) => {
  let students = await studentsData()
  let names = [...students].filter(elm => elm.selected === false && elm)
  const members = req.body.mmbr
  let sbjGroup = []

  if(names.length == 0){
    await updateStudent(sbjGroup, true)
    students = await studentsData()
    names = [...students].filter(elm => elm.selected === false && elm)
  } 

  if(names.length >= members){
    for(let i=0; i < members; i++){
      const random = names[Math.floor(Math.random() * names.length)]
      sbjGroup.push(random)
      names.splice(names.indexOf(random), 1)
    }  
  } else {
    sbjGroup = [...names]
  }

  await updateStudent(sbjGroupmap.map(elm => elm._id), false)

  await fetch('http://localhost:3001/addTechWatch' ,{
    method: 'post',
    body: JSON.stringify({
      subject: req.body.subj,
      deadline: req.body.dline, 
      group: sbjGroup.map(elm => elm.name)}),
    headers :{'Content-type': 'application/json'}
  })
  res.redirect('/assignation')
})

/*---------------pages rendering-------------------------*/

app.get('/', async (req, res) => {
  let data = await studentsData()
  data = data.filter(elm => elm.selected === false && elm)
  res.render('pages/index', {data: data, title: 'home'})
})
.get('/students', async (req, res) => {
  const data = await studentsData()
  res.render('pages/students', {data: data, title: 'students'})
})
.get('/assignation', (req, res) => {
  res.render('pages/assignation', {title: 'assignation'})
})
.get('/history', (req, res) => {
  res.render('pages/history', {title: 'history'})
})

app.listen(8080)
