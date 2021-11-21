var ingredCounter = 3;

var instructCounter = 3;

//creating the hamburger menu
const hamburger = document.querySelector(".hamburger");
const links = document.querySelector(".links");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
  hamburger.classList.toggle("active");
  links.classList.toggle("active");
}

const navLink = document.querySelectorAll(".nav-link");

navLink.forEach((n) => n.addEventListener("click", closeMenu));

function closeMenu() {
  hamburger.classList.remove("active");
  links.classList.remove("active");
}

function route() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#/", "");

  //takes you to the home page if the url is empty
  if (pageID == "") {
    navToPage("home");
  } else {
    navToPage(pageID);
  }
}

//function that takes you to the page based on the pageID
function navToPage(pageName) {
  MODEL.getPageContent(pageName);
  // console.log("nav to page");
}

function pagelistener() {
  $(window).on("hashchange", route);
  route();
  // console.log("pagelistener");
}

function initFirebase() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("connected");
      $(".btn-signout").css("display", "block");
      $(".hide").css("display", "block");
      $("nav .links").css("width", "740px");
      $("#btn-login").css("display", "none");
      $("footer .footer-links").css("width", "750px");
    } else {
      console.log("user is not there");
      $(".btn-signout").css("display", "none");
      $(".hide").css("display", "none");
      $("nav .links").css("width", "451px");
      $("#btn-login").css("display", "block");
      $("footer .footer-links").css("width", "550px");
    }
  });
}

function loadPublicRecipe() {
  console.log("load public recipe");
  // $("#app").empty();
  $(".display-recipes").css("display", "none");
  $.getJSON("data/data.json", function (recipes) {
    // console.log(recipes.User_Recipes);
    // console.log(recipes.Public_Recipes[0].recipeName);
    // console.log(recipes.Public_Recipes[0].recipeDescription);

    //lops through user recipes
    $.each(recipes.Public_Recipes, function (index, recipe) {
      // console.log("recipe: " + recipe.recipeName);
      $("#app .browse .recipes-holder").append(
        ` <div class="recipe-container">
        <img src="${recipe.recipeImg}" alt="">
        <div class="recipe-info">
            <h1>${recipe.recipeName}</h1>
            <p class="recipe-par">${recipe.recipeDescription}</p>
            <div class="time-holder">
                <div class="timer-img"></div>
                <p>${recipe.recipeTime}</p>
            </div>
            <div class="serving-holder">
                <div class="serving-img"></div>
                <p>${recipe.recipeServings}</p>
            </div>
        </div>
    </div>`
      );
    });
  }).fail(function (jqxhr, textStatus, error) {
    console.log(jqxhr + " text " + textStatus + " " + error);
  });
}

function createUser() {
  let password = document.getElementById("password-signup").value;
  let email = document.getElementById("email-signup").value;
  let fName = document.getElementById("fname-signup").value;
  let lName = document.getElementById("lname-signup").value;

  // alert(fName + " " + lName + " " + email + " " + password);

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log(userCredential.user);
      navToPage("home");
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage); //make this an alert to show users
      alert("An error occured. Please try again.");
      // ..
    });
}

function login() {
  let password = document.getElementById("password-login").value;
  let email = document.getElementById("email-login").value;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log("signed in");
      navToPage("home");
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      alert("Invalid email or password. Please try again.");
    });
}

function signout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("signed out");
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
}

function initlistener() {
  $("nav a").click(function (e) {
    // e.preventDefault();
    let btnID = e.currentTarget.id;
    if (btnID == "create") {
      createUser();
    } else if (btnID == "login") {
      login();
    } else if (btnID == "signout") {
      signout();
    }
  });
}

function addIngredient(e) {
  ingredCounter++;
  $(".ingredients").append(
    ` <input id="ind${ingredCounter}" type="text" placeholder="Ingredient ${ingredCounter}">`
  );
}

function addInstruction(e) {
  instructCounter++;
  $(".instructions").append(
    ` <input id="inst${instructCounter}" type="text" placeholder="Instruction ${instructCounter}">`
  );
}

function createUserRecipe(e) {
  event.preventDefault();
}

$(document).ready(function () {
  try {
    let app = firebase.app();
    initFirebase();
    initlistener();
  } catch {
    // console.error(e);
  }

  pagelistener();

  //use when developing to take your directly to the page you want to work on
  // navToPage("home");
});
