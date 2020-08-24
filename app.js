const express = require('express')
const fetch = require('node-fetch')
const app = express()

app.use (express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine','ejs')
app.use(express.static('./public'))

// fuctions to get student and techWatch data and to update students status //
const studentsData = async () => {
  const fetchedStdn = await fetch('http://localhost:3001/getstudents')
  return fetchedStdn.json()
}

const techWatchsData = async () => {
  const fetchedTech = await fetch('http://localhost:3001/getTechWatch')
  return fetchedTech.json()
}

const updateStudent = async (obj, rst) => {
  await fetch('http://localhost:3001/updateStudents', {
    method: 'put',
    body: JSON.stringify({objects: obj, reset: rst}),
    headers :{'Content-type': 'application/json'}
  })
}
//////////////////////// Add new student ////////////////////////
app.post('/addStudent', async (req, res) => {
  await fetch('http://localhost:3001/addstudents', {
    method: 'post',
    body: JSON.stringify({name: req.body.name, selected: false}),
    headers :{'Content-type': 'application/json'}
  })
  res.redirect('/students')
})
//////////////////////// Delete student ////////////////////////
.post('/deleteStudent', async (req, res) => {
  await fetch('http://localhost:3001/deleteStudents' ,{
    method: 'delete',
    body: JSON.stringify(req.body),
    headers :{'Content-type': 'application/json'}
  })
  res.redirect('/students')
})
//////////////////////// add TechWatch ////////////////////////
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

  if(names.length >= members) {
    for(let i=0; i < members; i++){
      const random = names[Math.floor(Math.random() * names.length)]
      sbjGroup.push(random)
      names.splice(names.indexOf(random), 1)
    }  
  } else { sbjGroup = [...names] }

  await updateStudent(sbjGroup.map(elm => elm._id), false)

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

//////////////////////// rendering home page ////////////////////////
app.get('/', async (req, res) => {
  const tdata = await techWatchsData()
  let sdata = await studentsData()
  const nextTech = []
  tdata.forEach(element => {
    const todayDate = new Date() 
    const dateOne = new Date(element.deadline)    
    todayDate < dateOne && nextTech.push(element)
  })
  nextTech.sort((a, b) => a.deadline.localeCompare(b.deadline))
  sdata = sdata.filter(elm => elm.selected === false && elm)
  res.render('pages/index', {data: sdata, techData: nextTech.slice(0, 2), title: 'home'})
})
//////////////////////// rendering student page ////////////////////////
.get('/students', async (req, res) => {
  const data = await studentsData()
  res.render('pages/students', {data: data, title: 'students'})
})
//////////////// rendering Tech-watch Assignation page ////////////////
.get('/assignation', async (req, res) => { 
  const tdata = await techWatchsData()
  const nextTech = []
  tdata.forEach(element => {
    const todayDate = new Date() 
    const dateOne = new Date(element.deadline)    
    todayDate < dateOne && nextTech.push(element)
  })
  nextTech.sort((a, b) => a.deadline.localeCompare(b.deadline))
  res.render('pages/assignation', {techData: nextTech, title: 'assignation'})
})
////////////////// rendering History Tech-watch page ///////////////////
.get('/history', async (req, res) => {
  const tdata = await techWatchsData()
  let nextTech = [], prevTech = []
  tdata.forEach(elm => {
    const todayDate = new Date() 
    const dateOne = new Date(elm.deadline)    
    todayDate <= dateOne ? nextTech.push(elm) : prevTech.push(elm)  
  })
  nextTech.sort((a, b) => a.deadline.localeCompare(b.deadline))
  prevTech.sort((a, b) => b.deadline.localeCompare(a.deadline))
  res.render('pages/history', {next: nextTech, prev: prevTech, title: 'history'})
})

app.listen(8080)