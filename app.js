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

const techWatchsData = async () => {
  const fetchedTech = await fetch('http://localhost:3001/getTechWatch')
  return await fetchedTech.json()
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
.post('/deleteStudent', async (req, res) => {
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

/*---------------pages rendering-------------------------*/

app.get('/', async (req, res) => {
  const tdata = await techWatchsData()
  let sdata = await studentsData()
  sdata = sdata.filter(elm => elm.selected === false && elm)
  res.render('pages/index', {data: sdata, techData: tdata, title: 'home'})
})
.get('/students', async (req, res) => {
  const data = await studentsData()
  res.render('pages/students', {data: data, title: 'students'})
})
.get('/assignation', async (req, res) => { 
  const data = await techWatchsData()
  res.render('pages/assignation', {techData: data, title: 'assignation'})
})
.get('/history', async (req, res) => {
  const tdata = await techWatchsData()
  let nextTech = [], prevTech = []
  tdata.forEach(element => {
    const todayDate = new Date(); //Today Date    
    const dateOne = new Date(element.deadline);    
    if(todayDate > dateOne){    
      prevTech.push(element)
    }else {    
      nextTech.push(element)
    }    
  })
  // console.log(next);
  // console.log('------------------------');
  // console.log(prev);
  res.render('pages/history', {next: nextTech, prev: prevTech, title: 'history'})
})

app.listen(8080)
