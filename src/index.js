const loginButton = document.getElementById("login");
const registerButton = document.getElementById("register");
const signOutButton = document.getElementById("sign_out")
const checkStatusButton = document.getElementById("check")
const loginForm = document.getElementById("login-form")
const registerForm = document.getElementById("register-form")
const loginPageButton = document.getElementById("login-page")
const registerPageButton = document.getElementById("register-page")
const tradePageButton = document.getElementById("tradePage")
const tradeTable = document.getElementById("tradeTable")
let user_id
let user_email

 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 import { getAuth,createUserWithEmailAndPassword,onAuthStateChanged,signInWithEmailAndPassword,signOut} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxPhco4KSA4ufmW6ZEQ-woWGaEn-L1WNM",
  authDomain: "trading-within-moringa-login.firebaseapp.com",
  projectId: "trading-within-moringa-login",
  storageBucket: "trading-within-moringa-login.appspot.com",
  messagingSenderId: "992265070122",
  appId: "1:992265070122:web:e6e8dbace6a29173448553",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded",checkStatus) // Add event listener to trigger checkStatus upon DOM content loaded

function checkStatus(){
  onAuthStateChanged(auth,(user)=>{
    if(user){
      user_id=user.uid
      user_email=user.email
      loginPageButton.style.display = "none"
      
      

    }
    else{
      //user is signed out
      loginForm.style.display="block"
      signOutButton.style.display = "none"

    }
  })
}

function register() {
  //get all input fields
  const email = document.getElementById("emailRegister").value;
  const password = document.getElementById("passwordRegister").value;
  const password2 = document.getElementById("password2Register").value;
  loginForm.style.display = "none"
 
  //validate input fields
  if (validate_password(password,password2) == false) {
    alert("Passwords do not match");
  }
  else if(validate_email(email) == false){
    alert("Kindly sign up with your moringa school email")
  }
  
  else{
     //Move on with auth
  createUserWithEmailAndPassword(auth,email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    registerForm.style.display = "none"
    signOutButton.style.display = "block"
    user_id=userCredential.uid
    user_email=user.email
    alert("User created");
  })
  .catch((error) => {
    //firebase will use this to alert its errors
    const error_code = error.code;
    const error_message = error.message;
  
   
  });
  }
 
}

function validate_email(email){
  if(email.includes("@moringaschool.com")){
    return true
  }
  else{
    return false
  }
}
function validate_password(password,password2) {
  if (password!=password2) {
    return false;
  } else {
    return true;
  }
}


function signIn(){
  const email = document.getElementById("emailLogin").value;
  const password = document.getElementById("passwordLogin").value;
 
  signInWithEmailAndPassword(auth,email,password)
  .then(userCredential=>{
    const user = userCredential.user;
    console.log(user);
    loginForm.style.display="none"
    loginPageButton.style.display = "none"
    signOutButton.style.display = "block"
    user_id = userCredential.uid
    user_email=user.email

    
  })
  .catch(error=>{
    const errorCode=error.code
    const errorMessage = error.message
    alert(errorCode);
  })

}

function signOutUser(){
  signOut(auth)
  .then(()=>{
    loginPageButton.style.display = "block"
    signOutButton.style.display = "none"
    tradeTable.style.display = "none"
  
  .catch((error)=>{
    const errorCode=error.code
    alert(error.message)
  })

  })
}

function displayLoginForm(){
  loginForm.style.display="block"
  registerForm.style.display = "none"
  tradeTable.style.display = "none"
}

function displayRegisterForm(){
  loginForm.style.display = "none"
  registerForm.style.display="block"
}

function displayTradeItems(){
  tradeTable.style.display = "block"
  loginForm.style.display = "none"
  registerForm.style.display = "none"
  fetch("http://localhost:3000/items")
  .then(res=>res.json())
  .then(data=>{
    data.forEach(product=>{
     
      if(product.owner_id!=user_id){
        const item = document.createElement("tr")
        item.innerHTML = `
        <td>${product.name}</td>
        <td>${product.details}</td>
        <td>${product.price}</td>
        <td id="E${product.id}">${product.owner_email}</td>
        <button id="P${product.id}">Purchase</button>
        
        `
        tradeTable.appendChild(item)
        
        purchaseProduct(product)
        

      }
    }
    
    )
    tradePageButton.disabled = true
  })
}

function purchaseProduct(product){
  const purchaseBtn=document.getElementById(`P${product.id}`)
  const ownerEmail = document.getElementById(`E${product.id}`)
  purchaseBtn.addEventListener("click",()=>{
    fetch(`http://localhost:3000/items/${product.id}`,{
      method:"PATCH",
      headers:{
        "Content-Type":"application/json",
        "Accept":"application/json"
      },
      body:JSON.stringify(
        {owner_id:user_id,
        owner_email:user_email
        }
      )
    })
    .then(res=>res.json())
    .then(data=>{
      ownerEmail.textContent=data.owner_email
    })
  })
 
}


registerButton.addEventListener("click", register);
loginButton.addEventListener("click",signIn)
signOutButton.addEventListener("click",signOutUser)
loginPageButton.addEventListener("click",displayLoginForm)
registerPageButton.addEventListener("click",displayRegisterForm)
registerPageButton.style.cursor="pointer"
tradePageButton.addEventListener("click",displayTradeItems)
