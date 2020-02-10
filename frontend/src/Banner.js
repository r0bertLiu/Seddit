function createBanner(root_div) {
    var new_header = document.createElement("header");
    new_header.className = "banner";
    new_header.id = "nav";
    root_div.appendChild(new_header);
    // create logo header
    var new_h1 = document.createElement("h1");
    new_h1.id = "logo";
    new_h1.className = "flex-center";
    new_h1.appendChild(document.createTextNode("Seddit"));
    new_header.appendChild(new_h1);
    // create nav ul
    var new_ul = document.createElement("ul");
    new_ul.className = "nav";
    new_header.appendChild(new_ul);
    // create three nav-item
    var new_li1 = document.createElement("li");
    var new_li2 = document.createElement("li");
    var new_li3 = document.createElement("li");
    new_li1.className = "nav-item";
    new_li2.className = "nav-item";
    new_li3.className = "nav-item";
    new_ul.appendChild(new_li1);
    new_ul.appendChild(new_li2);
    new_ul.appendChild(new_li3);
    // create search bar
    var new_input = document.createElement("input");
    new_input.id = "search";
    new_input.type = "search";
    new_input.placeholder = "Search Seddit";
    new_li1.appendChild(new_input);
    // create login, signup modal and profile modal
    makeLogInModal(root_div);
    makeSignUPModal(root_div);
    // create log_in button
    var log_button = document.createElement("button");
    log_button.className = "button button-primary";
    log_button.setAttribute('data-id-login', "")
    log_button.appendChild(document.createTextNode("Log In"))
    log_button.addEventListener("click", logInBtn);
    // create sign_up button
    var sign_button = document.createElement("button");
    sign_button.className = "button button-primary";
    sign_button.setAttribute('data-id-signup', '');
    sign_button.appendChild(document.createTextNode("Sign Up"));
    sign_button.addEventListener("click", signUpBtn);
   // create log_out button
   var out_button = document.createElement("button");
   out_button.className = "button button-secondary";
  //  out_button.setAttribute('data', 'id-logout');
   out_button.appendChild(document.createTextNode("Log Out"))
   out_button.addEventListener("click", logOutBtn);
   // create Profile 
   var profile_button = document.createElement("button");
   profile_button.className = "button button-secondary";
   profile_button.appendChild(document.createTextNode("My Page"));
   profile_button.addEventListener("click", MyPageBtn);    
  // add nav button (according to the state of app)
  if (Number(localStorage.logged_in) === 0) {
    new_li2.appendChild(log_button);
    new_li3.appendChild(sign_button);
  } else {
    new_li2.appendChild(profile_button);
    new_li3.appendChild(out_button);
  }
}

function makeLogInModal(root_div){
  // create logIn_modal_div; the jump out window
  var logIn_modal_div = document.createElement("div");
  logIn_modal_div.id = "logInModal";
  logIn_modal_div.className = "modal";
  root_div.appendChild(logIn_modal_div);
  // create the content inside modal
  var logIn_content = document.createElement("div");
  logIn_content.className = "modal-content";
  logIn_modal_div.appendChild(logIn_content);
  // create element(form) inside window
  // create span
  var logIn_span = document.createElement("span");
  logIn_span.className = "close";
  logIn_span.appendChild(document.createTextNode("\xD7"));
  // click span to quit from logIn modal
  logIn_span.onclick = function() {
    logIn_modal_div.style.display = "none";
    warning_text.style.display = "none";
    username_input.value = '';
    password_input.value = '';
  }
  logIn_content.appendChild(logIn_span);
  // create login form
  var logIn_form = document.createElement("form");
  logIn_form.className = "form";
  logIn_form.name = "login";
  logIn_content.appendChild(logIn_form);
  // create content inside login form
  var logIn_head = document.createElement("div");
  logIn_head.className = "formHead";
  logIn_head.appendChild(document.createTextNode("LOG IN"));
  logIn_form.appendChild(logIn_head);
  // username label
  var username_label = document.createElement("label");
  username_label.className = "formLabel";
  username_label.appendChild(document.createTextNode("Username:"))
  // username filed
  var username_input = document.createElement("input");
  username_input.placeholder = "Please insert your Username";
  username_input.type = "text";
  username_input.name = "username";
  // password label
  var password_label = document.createElement("label");
  password_label.className = "formLabel";
  password_label.appendChild(document.createTextNode("Password:"));
  // password filed
  var password_input = document.createElement("input");
  password_input.placeholder = "Please insert your Password";
  password_input.type = "password";
  password_input.name = "password";
  // submit button
  var submit_btn = document.createElement("input");
  submit_btn.type = "submit";
  submit_btn.name = "Login";
  submit_btn.value = "Log In"
  submit_btn.appendChild(document.createTextNode("Submit"));
  // warning text
  var warning_text = document.createElement('div');
  warning_text.className = 'input-warning';
  warning_text.appendChild(document.createTextNode('anything'));
  logIn_form.appendChild(username_label);
  logIn_form.appendChild(username_input);
  logIn_form.appendChild(password_label);
  logIn_form.appendChild(password_input);
  logIn_form.appendChild(warning_text);
  logIn_form.appendChild(submit_btn);
  logIn_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = logIn_form.elements.username.value;
    const password = logIn_form.elements.password.value;
    if (username === '' || password === ''){
      // alert('please enter a username and password');
      warning_text.textContent = "please enter username and password";
      warning_text.style.display = "block";
    } else {
      const payload = {
        "username": `${username}`,
        "password": `${password}`
      };
      // var data = new FormData();
      // data.append("json", JSON.stringify(payload));
      
      const data = {
        "method" : 'POST',
        "headers" : {
          "Content-Type": "application/json"
        },
        "body" : JSON.stringify(payload)
      };

      var response = fetch("http://127.0.0.1:5000/auth/login", data);
      // check Authentication
      response.then(function(response) {
        if (response.status !== 200) {
          warning_text.textContent = 'invalid username or password';
          warning_text.style.display = "block";
        } else {
          // get user token and log in
          response.json()
          .then(data => localStorage.setItem("usertoken", JSON.stringify(data)));
            localStorage.logged_in = 1;
            location.reload();
        }
      });
    }
  });
}
  
function makeSignUPModal(root_div) {
  // create signUp_modal_div; the jump out window
  var signUp_modal_div = document.createElement("div");
  signUp_modal_div.id = "signUpModal";
  signUp_modal_div.className = "modal";
  root_div.appendChild(signUp_modal_div);
  // create the content inside modal
  var signUp_content = document.createElement("div");
  signUp_content.className = "modal-content";
  signUp_modal_div.appendChild(signUp_content);
  // create element(form) inside window
  // create span
  var signUp_span = document.createElement("span");
  signUp_span.className = "close";
  signUp_span.appendChild(document.createTextNode("\xD7"));
  // click span to quit from signUp modal
  signUp_span.onclick = function() {
    signUp_modal_div.style.display = "none";
    warning_text.style.display = "none";
    username_input.value = '';
    password_input.value = '';
    re_password_input.value = '';
    email_input.value = '';
    name_input.value = '';
  }
  signUp_content.appendChild(signUp_span);
  // create signUp form
  var signUp_form = document.createElement("form");
  signUp_form.className = "form";
  signUp_form.name = "signup";
  signUp_content.appendChild(signUp_form);
  // create content inside signUp form
  var signUP_head = document.createElement("div");
  signUP_head.className = "formHead";
  signUP_head.appendChild(document.createTextNode("SIGN UP"));
  signUp_form.appendChild(signUP_head);
  // username label
  var username_label = document.createElement("label");
  username_label.className = "formLabel";
  username_label.appendChild(document.createTextNode("Username:"))
  // username field
  var username_input = document.createElement("input");
  username_input.placeholder = "Please insert your Username";
  username_input.type = "text";
  username_input.name = "username";
  // password label
  var password_label = document.createElement("label");
  password_label.className = "formLabel";
  password_label.appendChild(document.createTextNode("Password:"));
  // password field
  var password_input = document.createElement("input");
  password_input.placeholder = "Please insert your Password";
  password_input.type = "password";
  password_input.name = "password";
  //re password field
  var re_password_input = document.createElement("input");
  re_password_input.placeholder = "Please insert your Password again";
  re_password_input.type = "password";
  re_password_input.name = "re_password";
  // e-mail label
  var email_label = document.createElement("label");
  email_label.className = "formLabel";
  email_label.appendChild(document.createTextNode("e_mail:"));
  // e-mail filed
  var email_input = document.createElement("input");
  email_input.placeholder = "Please insert your e-mail address";
  email_input.type = "text";
  email_input.name = "email";
  // name label
  var name_label = document.createElement("label");
  name_label.className = "formLabel";
  name_label.appendChild(document.createTextNode("name:"));
  // name filed
  var name_input = document.createElement("input");
  name_input.placeholder = "Please insert your name";
  name_input.type = "text";
  name_input.name = "name";
  // warning text
  var warning_text = document.createElement('div');
  warning_text.className = 'input-warning';
  warning_text.appendChild(document.createTextNode('anything'));
  // submit button
  var submit_btn = document.createElement("input");
  submit_btn.type = "submit";
  submit_btn.name = "Login";
  submit_btn.value = 'Sign Up'
  submit_btn.appendChild(document.createTextNode("Submit"));
  signUp_form.appendChild(username_label);
  signUp_form.appendChild(username_input);
  signUp_form.appendChild(password_label);
  signUp_form.appendChild(password_input);
  signUp_form.appendChild(re_password_input);
  signUp_form.appendChild(email_label);
  signUp_form.appendChild(email_input);
  signUp_form.appendChild(name_label);
  signUp_form.appendChild(name_input);
  signUp_form.appendChild(warning_text);
  signUp_form.appendChild(submit_btn);
  signUp_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = signUp_form.elements.username.value;
    const password = signUp_form.elements.password.value;
    const re_password = signUp_form.elements.re_password.value;
    const email = signUp_form.elements.email.value;
    const name = signUp_form.elements.name.value;
    if (username === '' || password === '' || re_password === '' || email === '' || name === ''){
      warning_text.textContent = 'please fill all the things';
      warning_text.style.display = "block";
    } else if (password !== re_password ) {
      warning_text.textContent = 'Passwords dont match';
      warning_text.style.display = "block";
    } else if (checkMail(email) !== '@') {
      warning_text.textContent = 'invailid format of e-mail';
      warning_text.style.display = "block";
    } else {
      const payload = {
        "username": `${username}`,
        "password": `${password}`,
        "email": `${email}`,
        "name": `${name}`
      };
      
      // var data = new FormData();
      // data.append("json", JSON.stringify(payload));
      const data = {
        "method" : 'POST',
        "headers" : {
          "Content-Type": "application/json"
        },
        "body" : JSON.stringify(payload)
      };

      var response = fetch("http://127.0.0.1:5000/auth/signup", data);
      // check Authentication
      response.then(function(response){
        if (response.status === 409) {
          warning_text.textContent = 'Username has been Taken';
          warning_text.style.display = "block";
        } else if (response.status !== 200) {
          warning_text.textContent = 'Internal error';
          warning_text.style.display = "block";
        } else {
          // get user token and log in
          response.json()
          .then(data => localStorage.setItem("usertoken", JSON.stringify(data)));
          localStorage.logged_in = 1;
            location.reload();
        }
      });
    }
  });
}

function logInBtn() {
  let logIn_modal_div = document.getElementById("logInModal");
  logIn_modal_div.style.display = "block";
}
  
function signUpBtn() {
  let signUp_modal_div = document.getElementById("signUpModal");
  signUp_modal_div.style.display = "block";
}

function logOutBtn() {
  localStorage.removeItem("logged_in");
  localStorage.removeItem("usertoken");
  localStorage.removeItem("last_posts");
  let root_div = document.getElementById("root");
  let profile_modal_div = document.getElementById("profileModal");
  root_div.removeChild(profile_modal_div);
  alert("Logout successful");
  location.reload();
}

function MyPageBtn() {
  let profile_modal_div = document.getElementById("profileModal");
  profile_modal_div.style.display = 'block';
}

function checkMail(str) {
  var patt = /@/i;
  return str.match(patt).toString();
}

export default createBanner;