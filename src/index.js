const tradePageButton = document.getElementById("tradePage") // Button to display trading page data
const sellItemsPageButton = document.getElementById("sellItemsPage")
const ownedItemsPageButton = document.getElementById("ownedItemsPage") // Button to display owned items page data
const loginPageButton = document.getElementById("login-page") // Button to display login form
const registerPageButton = document.getElementById("register-page") // Button to display register form
const loginForm = document.getElementById("login-form") // Selects the login form
const registerForm = document.getElementById("register-form") // Selects the register form
const sellItemsForm = document.getElementById("sellItemsForm") // Selects the sell items form
const loginButton = document.getElementById("login"); // Selects the login button
const registerButton = document.getElementById("register"); // Selects the register button
const signOutButton = document.getElementById("sign_out") // Selects the sign out button
const forgottenPassword = document.getElementById("forgotten")
const searchForm = document.getElementById("search")

const tradeItemsCardContainer = document.getElementById("tradeItemsContainer") // Container for trading items
const ownedItemsCardsContainer = document.getElementById("ownedItemsContainer") // Container for owned items


let user_id // Variable to store the user ID
let user_email // Variable to store the user email
let userLoggedIn; // Variable to track if the user is logged in or not

// Set the pointer style for clickable elements
registerPageButton.style.cursor="pointer"

// Adding event listeners to the button to manage click events
registerButton.addEventListener("click", register);
loginButton.addEventListener("click",signIn)
signOutButton.addEventListener("click",signOutUser)
loginPageButton.addEventListener("click",displayLoginForm)
registerPageButton.addEventListener("click",displayRegisterForm)
sellItemsPageButton.addEventListener("click",displaySellItemsForm)
forgottenPassword.addEventListener("click",resetPassword)

// Calling functions to display different pages
tradePageButton.addEventListener("click",displayTradeItems)
ownedItemsPageButton.addEventListener("click",displayOwnedItems)

 // Import needed functions from firebase
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js"; // Import Firebase app module

 import { getAuth,createUserWithEmailAndPassword,onAuthStateChanged,signInWithEmailAndPassword,signOut,sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js"; // Import Firebase authentication functions

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxPhco4KSA4ufmW6ZEQ-woWGaEn-L1WNM",
  authDomain: "trading-within-moringa-login.firebaseapp.com",
  projectId: "trading-within-moringa-login",
  storageBucket: "trading-within-moringa-login.appspot.com",
  messagingSenderId: "992265070122",
  appId: "1:992265070122:web:e6e8dbace6a29173448553",
};


const app = initializeApp(firebaseConfig); // Initializes Firebase app
const auth = getAuth(app); // Initialize Firebase authentication


document.addEventListener("DOMContentLoaded",()=>{
  checkStatus()
 setTimeout(() => {
  displayTradeItems() // Invokes displayTradeItems function after a 300ms delay to allow checkStatus to run first on page refresh or initial load
 },300);



}) // Add event listener to check user status when DOM is loaded

//Function checks whether user is logged in or not
function checkStatus(){
  onAuthStateChanged(auth,(user)=>{
    if(user){ //if user is already logged in
      user_id=user.uid // Set user ID
     
      user_email=user.email // Set user email
      loginPageButton.style.display = "none" // Hide login page button
      userLoggedIn=true // Set user as logged in

    }
    else{
      // User is signed out
      signOutButton.style.display = "none" // Hide sign out button
      userLoggedIn=false // Set user as logged out

    }
  })
}

//function to register new users
function register() {
  // Get all input fields
  const email = document.getElementById("emailRegister").value;
  const password = document.getElementById("passwordRegister").value;
  const password2 = document.getElementById("password2Register").value;
  loginForm.style.display = "none" // Hide login form immediately when one opts to register account

  // Validate input fields with validation functions
  if (validate_password(password,password2) == false) {
    alert("Passwords do not match"); // Alert if passwords don't match
  }
  else if(validate_email(email) == false){
    alert("Kindly sign up with your moringa school email") // Alert if email is not valid
  }

  else{
     // Proceed with authentication if validations pass
  createUserWithEmailAndPassword(auth,email, password)
  .then((userCredential) => {
    const user = userCredential.user; // store user data after user is logged in
    registerForm.style.display = "none" // Hide register form
    signOutButton.style.display = "block" // Show sign out button
    tradeItemsCardContainer.style.display = "flex"; // Show trade items container
    tradeItemsCardContainer.style.flexWrap = "wrap"; // Set flex-wrap style
    tradeItemsCardContainer.style.justifyContent = "space-around" // Set justify content style
    user_id=user.uid // Set user ID from the created user credential
    user_email=user.email // Set user email from the created user credential
    alert("User created"); // Notify user of account creation
  })
  .catch((error) => {
    // Handle errors from Firebase
    const error_code = error.code; // Get error code from Firebase error
    alert(error_code) // Alert error code


  });
  }

}
//Functon to valiuate email
function validate_email(email){
  if(email.includes("moringaschool.com")){
    return true // Return true if email is a Moringa email
  }
  else{
    return false // Return false if email is not a Moringa email
  }
}

//Function to validate password
function validate_password(password,password2) {
  if (password!=password2) {
    return false; // Return false if passwords don't match
  } else {
    return true; // Return true if passwords match
  }
}

//Function to sign in user
function signIn(){
  const email = document.getElementById("emailLogin").value;
  const password = document.getElementById("passwordLogin").value;

  signInWithEmailAndPassword(auth,email,password)
  .then(userCredential=>{
    const user = userCredential.user; // User successfully signed in
    loginForm.style.display="none" // Hide login form
    loginPageButton.style.display = "none" // Hide login page button
    signOutButton.style.display = "block" // Show sign out button
    tradeItemsCardContainer.style.display = "flex"; // Show trade items container
    tradeItemsCardContainer.style.flexWrap = "wrap"; // Set flex-wrap style
    tradeItemsCardContainer.style.justifyContent = "space-around" // Set justify content style
    user_id = user.uid // Set user ID from signed-in user
    user_email=user.email // Set user email from signed-in user


  })
  .catch(error=>{
    const errorCode=error.code // Get error code from error
    const errorMessage = error.message // Get error message from error
    alert(errorCode); // Alert the error code
  })

}
function resetPassword(){
  const email = prompt("Enter your email address") // Prompts the user to enter their email address for password reset
  sendPasswordResetEmail(auth,email) // Sends a password reset email to the provided email address
  .then(()=>alert("Password reset email sent!")) // Alerts the user that the password reset email was sent successfully
  .catch((error)=>alert(error.code)) // Alerts the user of any errors that occur during the process
}

//function is called when user presses sign out
function signOutUser(){
  signOut(auth)
  .then(()=>{
    ownedItemsCardsContainer.innerHTML="" // Clear owned items container
    loginPageButton.style.display = "block" // Show login page button
    signOutButton.style.display = "none" // Hide sign out button
    displayTradeItems()// calls the function to display trade items
  
    user_id = "" // Clear user ID
    user_email = "" // Clear user email
  })
  .catch((error)=>{
    const errorCode=error.code // Get error code from error
    alert(error.message) // Alert the error message
  })
}

//function is called when user presses log in
function displayLoginForm(){
  loginForm.style.display="block" // Show login form
  registerForm.style.display = "none" // Hide register form
  tradeItemsCardContainer.style.display = "none" // Hide trade items container
  ownedItemsCardsContainer.style.display = "none" // Hide owned items container
  sellItemsForm.style.display = "none"
}

//Function is called when user wants to register account
function displayRegisterForm(){
  loginForm.style.display = "none" // Hide login form
  registerForm.style.display="block" // Show register form
}

//Function to display available trade items except the ones the user owns
function displayTradeItems(){
  tradeItemsCardContainer.innerHTML = ""
  ownedItemsCardsContainer.style.display = "none" // Hide owned items container
  loginForm.style.display = "none" // Hide login form
  registerForm.style.display = "none" // Hide register form
  sellItemsForm.style.display = "none"
  tradeItemsCardContainer.style.display = "flex"; // Show trade items container
  tradeItemsCardContainer.style.flexWrap = "wrap"; // Set flex-wrap style
  tradeItemsCardContainer.style.justifyContent = "space-around" // Set justify content style

  //Fetch items from server and display them using cards
  fetch("https://json-server-phase-1-project.onrender.com/items")
  .then(res=>res.json())
  .then(data=>{
    searchProduct(data)
    data.forEach(product=>{
      
      if(!document.getElementById(`O${product.id}`) && product.owner_id!=user_id){
        

        const card = document.createElement("div"); // Create a new card for each product
          card.classList.add("card", "m-2"); // Add classes to card
          card.style.width = "19.5rem"; // Set card width
          card.style.height = "32rem"
          card.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"; // Add box shadow to card
          // Added to enable zoom effect on hover
          card.style.transition = "transform 0.5s";
          card.onmouseover = () => card.style.transform = "scale(1.03)";
          card.onmouseout = () => card.style.transform = "scale(1)";
          card.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text" id="O${product.id}">${product.details}</p>
              <p class="card-text">Price: ${product.price}</p>

              <button id="P${product.id}" class="btn btn-primary">Purchase</button>
            </div>
          `;
          tradeItemsCardContainer.appendChild(card); // Append card to container

        purchaseProduct(product) // Call function to handle product purchase


      }
    }

    )
    
  })
  .catch(error=>{
    alert(error.message) // Alert error message in case of fetch failure
  })
}

function searchProduct(data){
  searchForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    tradeItemsCardContainer.innerHTML = ""

    data.forEach(product=>{
      if(!document.getElementById(`O${product.id}`) && product.owner_id!=user_id){
        // Check if the product is not owned by the current user and the element with the product id does not exist
        if(product.name.toLowerCase().includes(searchForm.search.value.toLowerCase())){
          // If the product name includes the search value then proceed with the operation

          const card = document.createElement("div"); // Create a new card for each product
          card.classList.add("card", "m-2"); // Add classes to card
          card.style.width = "19.5rem"; // Set card width
          card.style.height = "32rem"
          card.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"; // Add box shadow to card
          // Added to enable zoom effect on hover
          card.style.transition = "transform 0.5s";
          card.onmouseover = () => card.style.transform = "scale(1.03)";
          card.onmouseout = () => card.style.transform = "scale(1)";
          card.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text" id="O${product.id}">${product.details}</p>
              <p class="card-text">Price: ${product.price}</p>

              <button id="P${product.id}" class="btn btn-primary">Purchase</button>
            </div>
          `;
          tradeItemsCardContainer.appendChild(card); // Append card to container

        purchaseProduct(product) // Call function to handle product purchase

        }
      }
    }
    
    )
    
  })

  searchForm.addEventListener("input",()=>{
    // When input field changes, check if the search field is empty
    if (searchForm.search.value.length == 0) {
      // If search field is empty, display all trade items
      displayTradeItems()
    }
  })

}

//Updates server and also page contents when items are purchased
function purchaseProduct(product){
  const purchaseBtn=document.getElementById(`P${product.id}`)  // Selects the purchase button based on the product id

  checkStatus()   // Check if the user is currently logged in

  // Add click event listener to the purchase button
  purchaseBtn.addEventListener("click",()=>{
    product.previous_owner_email = product.owner_email
    if(userLoggedIn){
      // Sends a PATCH request to update the item's owner
      fetch(`https://json-server-phase-1-project.onrender.com/items/${product.id}`,{
      method:"PATCH",
      headers:{
        "Content-Type":"application/json",
        "Accept":"application/json"
      },
      body:JSON.stringify(
        {
        owner_id:user_id,
        owner_email:user_email,
        previous_owner_email:product.previous_owner_email
        }
      )
    })
    .then(res=>res.json())
    .then(()=>{
      // After successful purchase, disable the button and change its text
      const purchaseBtn=document.getElementById(`P${product.id}`)
      purchaseBtn.disabled = true
      purchaseBtn.textContent = "Owned"
      alert(`Successfully purchased ${product.name}! You will be contacted shortly to give your address information for delivery purposes.`)
    })
    // Alert the error if there is any during the fetch request
    .catch(error=>alert(error.message))

    }
    else{
      // If the user is not logged in, prompt for login
      alert("Kindly log in to start trading")
    }

  })

}

//Function to display items owned by user, called when user pressed Owned Items button
function displayOwnedItems(){
  // Check if the user is logged in hence updating value of userLoggedIn variable
  checkStatus();

  if(userLoggedIn){
    // Adjust display settings to show the owned items and hide others
    tradeItemsCardContainer.style.display = "none";
    loginForm.style.display = "none";
    sellItemsForm.style.display = "none"
    registerForm.style.display = "none";
    ownedItemsCardsContainer.style.display = "flex";
    ownedItemsCardsContainer.style.flexWrap = "wrap";
    ownedItemsCardsContainer.style.justifyContent = "space-around"
    // Fetches all items from the server
    fetch("https://json-server-phase-1-project.onrender.com/items")
    .then(res=>res.json())
    .then(data=>{
      // Iterates over each product and creates a card if owned by the user
      data.forEach(product=>{
        if(!document.getElementById(`E${product.id}`) && product.owner_id == user_id ){
         
          // Creates card element for each owned item
          const card = document.createElement("div");
          card.id =product.id
          card.classList.add("card", "m-2");
          card.style.width = "19rem";
          card.style.transition = "transform 0.5s";
          card.onmouseover = () => card.style.transform = "scale(1.03)";
          card.onmouseout = () => card.style.transform = "scale(1)";
          card.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"; // Adds shadow for styling
          // Sets the innerHTML of the card with product details
          card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" id="I${product.id}">
            <div class="card-body">
              <h5 class="card-title" id="N${product.id}">${product.name}</h5>
              <p class="card-text" id="D${product.id}">${product.details}</p>
              <p class="card-text" id="P${product.id}">${product.price}</p>
              <p><a href="mailto:${product.previous_owner_email}">Any issues with the product? Click here to contact the previous owner </a></p>
              <button id="E${product.id}" class="btn btn-primary">Edit Product</button>
              <button id="RD${product.id}" class="btn btn-danger">Remove product</button>
            </div>
          `;
          // Adds the created card to the container
          ownedItemsCardsContainer.appendChild(card);

          // Calls functions to edit or remove the product
          editProduct(product)
          removeProduct(product)
         ;
        }

    })})
    .catch(error=>error.message)

  }
  else{
    alert("Kindly log in first") // Alert user to log in if not already logged in
  }

}

//Function to edit details of products owned by user
function editProduct(product){
  // Select the edit button by product id
  const editButton = document.getElementById(`E${product.id}`)
  // Add event listener to handle edit action
  editButton.addEventListener("click",()=>{
    console.log(product.owner_email);
    if(!document.getElementById(`F${product.id}`)){ //first checks if the form already exists
      // Creates a form for editing product details
      const form = document.createElement("form")
      form.id=`F${product.id}`
      // Sets up form inputs for product details
      form.innerHTML=`
          <div class="mb-3">
            Image link: <input type="text" class="form-control" placeholder="Image link" name="image" value="${product.image}">
          </div>
          <div class="mb-3">
            Name: <input type="text" class="form-control" placeholder="Name" name="productName" value="${product.name}">
          </div>
          <div class="mb-3">
            Details: <textarea class="form-control" cols="30" rows="3" placeholder="Details" name="details">${product.details}</textarea>
          </div>
          <div class="mb-3">
            Price: <input type="text" class="form-control" placeholder="Price" name="price" value="${product.price}">
          </div>
            <button id="R${product.id}" class="btn btn-secondary">Discard changes</button>
            <button type="submit" class="btn btn-primary">Save changes</button>
      
      `      
      // Appends the form to the product card
      document.getElementById(product.id).appendChild(form)
      // Adds listener to discard changes button to remove the form
      document.getElementById(`R${product.id}`).addEventListener("click",()=>{
        form.remove()
      })
      // Handles the submit action for the form
      form.addEventListener("submit",(e)=>{
        e.preventDefault()
        // Sends PATCH request with the updated product details
        fetch(`https://json-server-phase-1-project.onrender.com/items/${product.id}`,{
          method:"PATCH",
          headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
          },
          body:JSON.stringify({
            name:form.productName.value,
            details:form.details.value,
            price:form.price.value,
            image:form.image.value
          })
        })
        .then(res=>res.json())
        .then(data=>{
          // Updates the product card with new details
          document.getElementById(`N${data.id}`).textContent=data.name
          document.getElementById(`D${data.id}`).textContent=data.details
          document.getElementById(`P${data.id}`).textContent=data.price
          document.getElementById(`I${data.id}`).src=data.image

          // Removes the form after saving changes
          form.remove()
        }
        )

    })

    }

  })

}

function removeProduct(product){
  // Select the remove button by product id
  const removeButton = document.getElementById(`RD${product.id}`)

  // Add event listener to handle remove action
  removeButton.addEventListener("click",()=>{
    // Confirm dialog to ensure user intends to remove the product
    if(confirm(`Kindly confirm that you want to remove ${product.name} from the market`)){
      // Sends DELETE request to remove the product
      fetch(`https://json-server-phase-1-project.onrender.com/items/${product.id}`,{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json"
        }
      }).catch(error=>{
        alert(error.message)
      })
    }

  })
}

function displaySellItemsForm(){
    // Hide various page elements to focus on the add items form
    checkStatus()
    if(userLoggedIn){
      tradeItemsCardContainer.style.display = "none";
    loginForm.style.display = "none";
    registerForm.style.display = "none";
    ownedItemsCardsContainer.style.display = "none";

    // Make the add items form visible
    sellItemsForm.style.display = "block";

    // Adding an event listener for the submit event on the form
    sellItemsForm.addEventListener("submit",(event)=>{
      // Prevent the default form submit action
      event.preventDefault();

      // POST request to add a new item to the server
      fetch("https://json-server-phase-1-project.onrender.com/items",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Accept":"application/json"
        },
        // Sending the form data as JSON
        body:JSON.stringify({
          name:sellItemsForm.productName.value,
          details:sellItemsForm.details.value,
          price:sellItemsForm.price.value,
          owner_id:user_id, // using the logged-in user's ID as owner ID
          owner_email:user_email, // using the logged-in user's email as owner email
          previous_owner_email:user_email, // setting the initial previous owner email as the user's email
          image:sellItemsForm.image.value, // image URL
        })
      })
      .then(()=>{
        sellItemsForm.reset(); // Resetting the form fields after successful submission
      })
    })


    }
    else{
      alert("Kindly log in first")
    }
}


