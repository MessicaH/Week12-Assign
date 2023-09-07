/* 
  Copyright (c) 2023 Promineo Tech
  Author:  Promineo Tech Academic Team
  Subject:  JavaScript CRUD Operations with JQuery
  FE Lab Week 12 + alterations for Week 12 Assignment
*/

/* ----------------------------------------------------- */
// Key Term List:
// JSON server
// JSON
// CRUD (Create, Read, Update, Delete)
// HTTP Verbs: GET, PUT/PATCH, POST, DELETE
// REST API
// naming conventions
// kebab-case
// SNAKE_CASE
// PascalCase
// camelCase

/* ----------------------------------------------------- */
// Please do not alter the existing code unless instructed to do so.
// Read the comments and add your code where it is specified for each question.
/* ----------------------------------------------------- */

/**
 * BEFORE YOU START:
 * You should be working in a folder containing 3 files: db.json, index.html, and week12Lab.js.
 *
 * The db.json should be an object. That object contains one key:value pair.
 * an object called "playerRoster" that is an array of objects with multiple
 * key:value pairs: "fullName", "researchAssignment", and "id".
 *
 * Your index.html has been set up with CDN's to use Jquery & Bootstrap.
 * Removing/changing any <script> or <link> elements may affect functionality.
 *
 * Do not change these or the data inside the db.json until you have completed
 * the project and/or feel comfortable changing them.
 *
 * GOAL: We are teaching a class of x number of players.
 *       For homework, we're assigning each player to research an animal.
 *
 *       We have an API endpoint: playerRoster
 *       The info is also in your db.json
 *
 *       1) Create a form that will GET/PUT/POST/DELETE to/from our playerRoster
 *       2) Create a section that displays our players name research assignment
 *
 *          This can be a table, a div, however you'd like to show the info.
 *          For this Lab, we'll be using a table.
 *
 *       You should be able to PUT(update)/DELETE(delete) existing players
 *           & POST(add) new players to the roster.
 *
 * Note: This lab uses Jquery/ajax for all CRUD operations.
 */

/*------------------------ Part 1: Setting up a JSON server ------------------------*/
console.log(`-------------------------- 
Part 1: Setup your JSON server`)

/**
 * Documentation: https://www.npmjs.com/package/json-server#getting-started
 *
 * Step 1: In your console, type: npm install -g json-server X
 *
 * Step 2: In your console, type: json-server --watch db.json X
 *         Your console should look something like this:
 *
 *         Resources
 *         http://localhost:3000/playerRoster X
 *         Update to: "https://64f42331932537f4051a219d.mockapi.io/groups" for D&D Mock.API
 *
 *         Above is the URL I'll use for  CRUD operations.
 *
 * Step 3: Below, create a const declaration for your URL endpoint
 *
 * ↓ YOUR CODE HERE ↓ */
const URL_ENDPOINT = "https://64f42331932537f4051a219d.mockapi.io/players"
/*------------------------ Part 2: HTTP Verb: GET ------------------------*/
console.log(
  `-------------------------- 
Part 2: GET and displaying the information`
)

/*
 * Step 1: Use $.get(api_url_here).then(data => console.log(data)) to check if
 *         our GET is set up correctly. You should be logging an array of objects.
 *
 * Step 2: Instead of logging, loop over data and add your information to the DOM.
 *         Reminder: While you are not required to, the lab solution uses a <table>
 *
 * ↓ YOUR CODE HERE ↓ */
$.get(URL_ENDPOINT).then(data => /*console.log(data))*/ {
  data.map(player => { // Name the entity that is being updated in the API
    $("tbody").append(
      $(`
      <tr>
        <td>${player.playername}</td>
        <td>${player.charname}</td>
        <td>${player.charclara}</td>
        <td class="delete-icon">
          <button class="btn btn-secondary delete-pc" onclick="deleteUser('${player.id}')"><i class="bi bi-trash3"></i></button>
        </td>
      </tr>
      `)
    )
  })
});


/*------------------------ Part 3: HTTP Verb: POST ------------------------*/
console.log(
  `-------------------------- 
Part 3: POST and adding new players`
)

/**
 * Step 1: Create a form in our HTML to post including
 *         label/inputs for each new player and a button to submit.
 *
 * Step 2: Add an event listener in your code below to the <button> element
 *         you created to log 'pls work' on click, just to make sure it's working.
 *
 * Step 3:
 * Docs:   https://api.jquery.com/jquery.post/
 *
 *         Replace the console.log('pls work') with jQuery's $.post() method.
 *
 *         The first argument is a URL, the second argument is an object containing
 *         the data to pass in. Use jquery to target the inputElement.val() of our form.
 *
 *         Your button should now post a new user on click.
 *
 * ↓ YOUR CODE HERE ↓ */
$("#submitCharacter").click(function () {
  $.post(URL_ENDPOINT, {
   // fullName: $("#fullName").val(),
   // researchAssignment: $("#newAssignment").val(),
    playername: $("#playername").val(),
    charname: $("#newCharname").val(),
    charclara: $("#newCharclara").val(),
  })
})

/*------------------------ Part 4: HTTP Verb: DELETE ------------------------*/
console.log(
  `-------------------------- 
Part 4: DELETE and deleting individual players`
)

/**
 * Docs:   https://api.jquery.com/jquery.ajax/
 *
 * Step 1: Create a new <td> element: a delete button for every player in part 2.
 *
 *         <button>delete</button>
 *
 *         Here's a lil' ASCII trash bin: 🗑
 *
 * Step 2: Let's handle deleting a little bit differently from post.
 *
 *         On the button element we just added, give it a property of onclick=""
 *         Inside the "", we're going to give it function to do.
 *
 * Step 3: Create a function called "deleteUser" below, that takes in an id as a parameter.
 *         Inside the code block, we're going to use jquery/ajax to delete a user.
 *
 * Step 4: Add the deleteUser() function inside our
 *         onclick="" on the delete button.
 *
 *         Make sure you are passing in the correct ID to deleteUser() above,
 *         and you have added the ID to the end of the ajax URL in the deleteUser() function.
 *
 *         Your elements should now be getting deleted!
 *
 * ↓ YOUR CODE HERE ↓ */
function deleteUser(id) {
  $.ajax(`${URL_ENDPOINT}/${id}`, {
    type: "DELETE",
  })
}


/*------------------------ HTTP Verb: UPDATE ------------------------*/
console.log(
  `-------------------------- 
Part 4: PUT/PATCH and updating the information`
)

/**
 * Step 1: Create a function called updateUser(){}
 *
 * Step 2: Create a form in our HTML to update a player's name/assignment by id.
 *         We need labels/input elements for id/playerName/researchAssignment.
 *
 * Step 3: Add a new header for players ID id in our table.
 * Step 4: Set up $.ajax() for 'PUT'
 *         We need two key/value pairs: method and data
 *
 *         Get the new id/name/research assignment by id, and pass those values
 *         into the appropriate places.
 *
 * Step 5: Add an event listener after your updateUser() function to
 *         do the updateUser function on click.
 *
 * ↓ YOUR CODE HERE ↓ */
function updateUser() {
  // Have the "updateId" auto-resolve with .val() finding its value
  let id = $("#updateId").val()
  
  // Target only one player at a time > use ${} to isolate/specify. But have ^^ resolve what "id" *is* before moving thru:
  $.ajax(`${URL_ENDPOINT}/${id}`, {
    method: "PUT",
    data: {
      playername: $("#updatePlayerName").val(),
      charname: $("#updateCharname").val(),
      charclara: $("#updateCharclara").val(),
    },
  })
}

  // Have "onclick" action update with above ^^ function's requests.
  $("#updatePlayer").click(updateUser)


console.log(`-----------Finished------------`)

/*------------------------ Optional: Style it with bootstrap! ------------------------*/

/*
 * Tables: https://getbootstrap.com/docs/5.3/content/tables/#overview
 * Forms: https://getbootstrap.com/docs/5.3/forms/overview/#overview
 *
 * There's no right or wrong here. Play around with different styles/reorganization.
 *
 * If you want some 'above and beyond' ideas:
 * 1) Instead of a table, look into organizing the players differently with bootstrap:
 *      Card, Accordion, Dropdowns, Popover, Tooltips
 *      Do a list group, and every item inside is one of the above
 * 3) Redo the update form - open the update form in a bootstrap modal when you click on
 *    a player, pass in the players id/name/assignment automatically to the form so the
 *    user can make edits to a form thats not initially blank.
 * 4) Re-style the delete button ASCII character to something more "modern"
 *
 */