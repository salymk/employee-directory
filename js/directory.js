// Global Variables

//empty array that will hold values from the API
let employees =[];
//string literal that stores the url of the API, complete with desired options
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`;
// stores the DOM element that is the container for the employees
const gridContainer = document.querySelector('.grid-container');
//stores the DOM element that acts as an overlay for the modal.
const overlay = document.querySelector('.overlay');
//stores the DOM element that is a container for the modal information.
const modalContainer = document.querySelector('.modal-content');
//stores the DOM element that is the modal’s close button
const modalClose = document.querySelector('.modal-close');
const modalRight = document.querySelector('.modal-right');
const modalLeft = document.querySelector('.modal-left');
//Search bar
const search = document.querySelector('#search');
let index;

//Fetch data from the API
fetch(urlAPI)
  //format the response as json
  .then(res => res.json())
  //return the results of the response
  .then(res => res.results)
  //pass the results into displayEmployees
  .then(displayEmployees)
  //catch any errors and show them in the console
  .catch(err => console.log(err));

//As the name suggests, this function displays all of the employees on the screen
function displayEmployees(employeeData) {
  //set the employees variable equal to employeeData so that it can be accessed
  //outside of this function
  employees = employeeData;

  //store the employee HTML as we create it
  let employeeHTML = '';

  //loop through each employee and create the HTML markup
  employees.forEach((employee, index) => {
    let name = employee.name;
    let email = employee.email;
    let city = employee.location.city;
    let picture = employee.picture;

    //using template literals add each employee markup
    employeeHTML += `
      <div class="card" data-index="${index}">
        <img class="avatar" src="${picture.large}">
        <div class="text-container">
          <h2 class="name">${name.first} ${name.last}</h2>
          <p class="email">${email}</p>
          <p class="address">${city}</p>
        </div>
      </div>
    `
  });
  //then pass the content of employeeHTML into the inner HTML of gridContainer
  gridContainer.innerHTML = employeeHTML;
}

//This function displays all of the employee info on the modals of employee
function displayModal(index) {
  //using object destructuring makes our template literal cleaner
  let {
    name, dob, phone, email,
    location: {city, street, state, postcode}, picture
  } = employees[index];

  //creates a new Date Object based on the employees date of birth
  let date = new Date(dob.date);

  //stores a template literal of the modal markup
  const modalHTML = `
  <img class="avatar" src="${picture.large}">
  <div class="text-container">
    <h2 class="name">${name.first} ${name.last}</h2>
    <p class="email">${email}</p>
    <p class="address">${city}</p>
    <hr/>
    <p>${phone}</p>
    <p class="address">${street.name},  ${state} ${postcode}</p>
    <p>Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
  </div>
  `;

  //remove the 'hidden' class from the modal
  overlay.classList.remove('hidden');
  //then pass the content of modalHTML into the inner HTML of modalContainer
  modalContainer.innerHTML = modalHTML;
}


//This event listener will display the modal of the employee card that we click
gridContainer.addEventListener('click', e => {
  //make sure the click is not on the gridContainer itself
  if (e.target !== gridContainer) {
    //select the card element based on its proximity to actual element clicked
    //closestElement is the Element which is the closest ancestor of the selected element
    const card = e.target.closest('.card');
    //get the data-index attribute from the card to the the displayModal function
    //data-index is the index value of the data we are using,
    //in this case it is the location of the data in the array we are getting back
    index = card.getAttribute('data-index');

    //call displayModal and pass in the card index
    displayModal(index);
  }
});

//This even listener closes the modal when you click the X
modalClose.addEventListener('click', () => {
  //classList adds new classes to html elements
  overlay.classList.add('hidden');
});

//Goes forward to the next employee
modalRight.addEventListener('click', e => {
  if (e.target !== gridContainer) {
    if (index >= employees.length - 1) {
      return;
    } else {
      index++;
      displayModal(index);
    }
  }
});

//Goes backward to the previous employee
modalLeft.addEventListener('click', e => {
  if (e.target !== gridContainer) {
    if (index <= 0) {
      return;
    } else {
      index--;
      displayModal(index);
    }
  }
});

//animation for search bar
search.addEventListener('mouseenter', () => {
  search.style.border = '1px solid #FFA500';
});

search.addEventListener('mouseleave', () => {
  search.style.border = '1px solid #E8E8E8';
});



//Search function
const handleSearch = event => {
  const employeeNames = document.querySelectorAll('.card .text-container .name');
  //This will track the letter the user typed into the search input field.
  //To capture the users input we need to access the value property of the input element: event.target.value.
  const searchTerm = event.target.value.toLowerCase();

  //Next we create a loop to cycle through all of the <p> elements on the page.
  employeeNames.forEach(employee => {
    //This variable looks at what the text inside of each <p> element is and converts it to lowercase.
    const text = employee.textContent.toLowerCase();
    //The next variable we declare will target the parent <div> element that the <p> element is nested inside of. This way we can hide the box completely if the text inside does not match the search term.
    const card = employee.parentElement.parentElement;

  //Lastly we add our conditional statements to check if the letter(s) the user typed into the search input, match letter(s) inside of the <p> elements text. We achieve this with the .indexOf() method. This method will return an index position number in the text array if letter(s) from the users search term match any in the text. If there is no match, it will return a value of -1.
//In our conditional we can check if the value is greater than -1 it will display the box, otherwise it will set the box to display: none;

  if(text.indexOf(searchTerm) > -1) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }

  });
}


search.addEventListener('keyup', handleSearch);
