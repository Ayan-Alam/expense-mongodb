const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");


document.getElementById('showSignup').addEventListener('click', function() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', function() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
});

document.getElementById('loginbtn').addEventListener('click', function(){
    const loginDetails = {
    loginEmail: loginEmail.value,
    loginPassword: loginPassword.value,
};
axios
.post("http://localhost:3000/post/getuser", loginDetails)
.then((result) => {
  console.log(result);
  alert('User LogIn Successfully');
  localStorage.setItem("token", result.data.token);
  window.location.href ='/expense/userDashboard';
})
.catch((error) => {
  if (error.response) {
    const errorMessage = error.response.data.message;
    alert(errorMessage);
  } else {
    alert("An error occurred. Please try again later.");
  }
});
})

