# Technology-Watch-Assignation-V3

![](https://img.shields.io/badge/node.js-gray?logo=node.js)
![](https://img.shields.io/badge/express.js-gray?logo=express.js)
![](https://img.shields.io/badge/mongodb-gray?logo=mongodb)
![](https://img.shields.io/badge/ejs-gray?logo=ejs)
![](https://img.shields.io/badge/scss-gray?logo=sass)


The aim of this project is to be able to create a list of students in one hand, and in the other hand be able to randomly assign a chosen Topic to a students who weren't assigned yet to a Technology Watch (groups generator). A single page in which we can add both students and Technology Watch.
using nodeJS, MongoDB and EJS for render an ejs template <br><br>

## contents
### Client-side
* [Home](#home)
* [Students](#Students)
* [Tech-watch](#Tech-watch)
* [Tech-Watch-history](#Tech-Watch-history)
* [Server-side](#Client-side)
<br><br>

## Client-side

### home

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
<br>

### Students

- The student list page displays an array with the name of all the students register with the possablity to add new student to the list or delelte a student form the list

<img src="https://github.com/mowafag-omer/Technology-Watch-Assignation-V3/blob/master/screenshots/1602525701880.png" width="70%" height="70%">

- display the students list

``` 
<section id="list">
  <h3>List of students</h3>
  <ul>
    <% data.forEach(function(object){ %>
      <li><%= object.name %></li>
    <% }) %>
  </ul>
</section>
``` 
   
- Add a new student to the list by submiting the form to "/addStudent" route
   
``` 
<form method="POST" action="/addStudent">
  <label for="addName"><b>Add student:</b> </label>
  <input type="text" id="addName" name="name" required>
  <input type="submit" value="Add student">
</form>
```

- delete a student from the list by submiting the form to "/deleteStudent" route
   
``` 
<form method="POST" action="/deleteStudent">
  <label for="sname"><b>Delete student:</b> </label>
  <select name="dname">
    <option value="name1">-----</option>
    <% data.forEach(function(object){ %>
      <option value="<%= object._id %>"><%= object.name %></option>
    <% }) %>
  </select>
  <input type="submit" value="Delete student">
</form>
```
<br><br>

### Tech-Watch

- Tech watch assignation page (Assignation.ejs) display all the next tech watch registered in the first section. This form is composed by three fields. First one is the subject of the tech-watch; second one the deadline and last one the number of students they will participate to this tech-watch.

<img src="https://github.com/mowafag-omer/Technology-Watch-Assignation-V3/blob/master/screenshots/1602541752.png" width="70%" height="70%">

- Display all next tech-watchs

``` 
<section id="nextTech">
  <h4>Next Tech-Watch</h4>
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

- Add new tech-watch with number of students and the deadline

``` 
<section id="addTech">
  <form method="POST" action="/createGroupe">
    <label for="sbj"><b>Subject:</b> </label>
    <input type="text" name="subj" id="sbj" required>
    <label for="ddln"><b>Deadline:</b> </label>
    <input type="date" name="dline" id="ddln" required>
    <label for="stdtNum"><b>Number students:</b> </label>
    <input type="number" name="mmbr" id="stdtNum" required>
    <input type="submit" value="Create Tech-watch">
  </form>
</section>
``` 

<br><br>

### Tech-Watch-history

- The history page is composed by two section. First one list of all next tech-watchs; the second one is the list of the previous tech-watchs.

<img src="https://github.com/mowafag-omer/Technology-Watch-Assignation-V3/blob/master/screenshots/1602543326000.png" width="70%" height="70%">

- Display the next tech-watchs

``` 
<section id="nextTech" style="background: #fff;">
  <h4>Next Tech-Watch</h4>
  <% next.forEach(function(tech){ %>
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

- Display all previous ones

``` 
<section id="prevTech">
  <h4>Previous Tech-watch</h4>
  <% prev.forEach(function(tech){ %>
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
