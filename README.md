# Technology-Watch-Assignation-V3

![](https://img.shields.io/badge/node.js-gray?logo=node.js)
![](https://img.shields.io/badge/express.js-gray?logo=express.js)
![](https://img.shields.io/badge/mongodb-gray?logo=mongodb)
![](https://img.shields.io/badge/ejs-gray?logo=ejs)
![](https://img.shields.io/badge/scss-gray?logo=sass)


The aim of this project is to be able to create a list of students in one hand, and in the other hand be able to randomly assign a chosen Topic to a students who weren't assigned yet to a Technology Watch (groups generator). A single page in which we can add both students and Technology Watch.
using nodeJS, MongoDB and EJS for render an ejs template <br><br>

## contents
* [Home](#Home)
* [Client-side](#Client-side)
* [Server-side](#Client-side)
<br><br>

## Client-side

### home.ejs

- The home page display first a general menu for access to other pages. Followed by another section displaying a welcome message. Next another section displays the two next tech-watch. And the final section displays the list of students they haven’t been assigned yet to a tech-watch.

<img src="https://github.com/mowafag-omer/Technology-Watch-Assignation-V3/blob/master/screenshots/1602523762292.png" width="70%" height="70%">

- display the two next tech-watch

``` 
<section id="nextTech">
<% techData.forEach(function(tech){ %>
  <div>
    <h4><%= tech.subject %></h4>
    <p>
      <span><b>Students affiliate:</b> <%= tech.group.join(' / ') %></span>
      <span><b>When:</b> <%= tech.deadline %></span>
    </p>
  </div>
<% }) %>
</section>
``` 
   
- display the list of students they haven’t been assigned yet to a tech-watch
   
``` 
<section id="students">
<h4>List of students they will must do a tech-watch soon:</h4>
<ul>
  <% data.forEach(function(object){ %>
    <li>- <%= object.name %></li>
  <% }) %>
</ul>
</section>
```

- add student route; store data in ajson file
```js
http.createServer(function (req, res,) {
  const page = url.parse(req.url)
  res.writeHead(200, {'Content-Type': 'text/html'})
  
  if(page.pathname == '/student'){
    let sname
    req.on('data', i => sname = i.toString())
    req.on('end', () => {
      // sname = new URLSearchParams(page.query).get('student')
      sname = parse(sname).student
      data.name.push([sname, 0])
      fs.writeFileSync('twdata.json', JSON.stringify(data))
    }) 
    res.writeHead(301, {Location: '/'})
  }
```
- add a technology topic and randomly assign a chosen topic to a Student who wasn't assigned yet to a Technology Watch; store data in ajson file
```js
 if(page.pathname == '/tech'){
    let tname, random
    req.on('data', i => tname = i.toString())
    req.on('end', () => {
      tname = parse(tname).tech
      const arr = data.name.filter(i => i[1] == 0 && i[0])
      if(arr.length){
        random = arr[Math.floor(Math.random() * arr.length)]
        data.name.forEach(i => i == random && (i[1] = 1))
        data.tech.push([tname, random[0]])
        fs.writeFileSync('twdata.json', JSON.stringify(data))
      }
    }) 
    res.writeHead(301, {Location: '/'})
  }
```
<br>

## Server-side
![Test Image](https://github.com/mowafag-omer/Technology-Watch-Assignation/blob/master/Capture.PNG)
- ejs view
```ejs
<div class="m-3">
    <ul style="list-style-type:none" class="p-0 mb-3">
      <% data.name.forEach(name => {%>
        <% if(name[1] == 1){ %>
          <li style="text-decoration: line-through;"><%= name[0] %></li>
        <% } else { %> 
          <li><%= name[0] %></li>
      <% }}) %> 
    </ul>
    <form method="POST" action="/student">
      <label for="Input1"><b>Student Name</b></label>
      <input type="text" name="student" class="form-control" id="Input1" placeholder="Student" required>
      <button type="submit" id = 'addStudent' class="btn btn-outline-success mt-3">Add</button>
    </form>

    <ul style="list-style-type:none" class="p-0 my-3">
      <% data.tech.forEach(tech => {%>
        <li><%= tech[0]%> - <%= tech[1]%></li>
      <% }) %> 
    </ul>
      <form method="POST" action="/tech">
        <label for="input2"><b>Technology</b></label>
        <input type="text" name="tech" class="form-control" id="input2" required>
        <button type="submit" class="btn btn-outline-success mt-3">Assign</button>
      </form>
      
      <form method="POST" action="/refresh">
        <button type="submit" class="btn btn-outline-danger mt-4">Refresh the list</button>
      </form>
  </div>
```
