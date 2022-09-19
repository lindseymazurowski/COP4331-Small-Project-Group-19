const urlBase = 'http://cop433119.xyz/LAMPAPI';
const extension = '.php';

let userId = 0;
let firstName = "";
let lastName = "";


function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginUser").value;
	let password = document.getElementById("loginPass").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try{
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 ){		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("loginResult").innerHTML = err.message;
	}

}


function doRegister()
{
    let username = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;
    let firstName = document.getElementById("registerFirstName").value;
    let lastName = document.getElementById("registerLastName").value;

	if (username == "" || password == "" || firstName == "" || lastName == ""){
		console.log("A required field for registration is missing.");
		return;
	}

    let temp = {firstName:firstName,lastName:lastName,login:username,password:password};
    let jsonPayload = JSON.stringify( temp );

    console.log(JSON.stringify( temp ));
    let url = urlBase + '/Register' + extension;
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try{
        console.log("Hit the try");
        xhr.send(jsonPayload)
		console.log("json payload in the air");
        xhr.onreadystatechange = function(){
            if (this.readyState === 4 && this.status === 200){
                console.log("Status good!");
                let jsonObject = JSON.parse( xhr.responseText );
                error = jsonObject.error;

                if (error != ""){
                    console.log("Failed...returning");
                    return;
                }

                console.log("Success!");

                saveCookie();
                setTimeout(function(){document.location.href = "index.html"},200);
            }

        }
    }
    catch (err){
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function saveCookie(){
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

//removes error once textfield is changed
function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

//Adding error message
function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const registerForm = document.querySelector("#register");

    //Hide login form, display register form
    document.querySelector("#linkRegisterAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        registerForm.classList.remove("form--hidden");
    });

    //Hide register form, display login form
    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        registerForm.classList.add("form--hidden");
    });

    //Performs Login
    /*loginForm.addEventListener("submit", e => {
        e.preventDefault();
    
        const username = loginForm.username.value;
        const password = loginForm.password.value;

        if(username === "JohnSmith" && pass === "DontKnow"){
            location.reload();
        }
        else{
            setFormMessage(loginForm, "error", "Invalid username/password combination");
        }
        
        //setFormMessage(loginForm, "error", "Invalid username/password combination");
    });*/

    //Performs Registration
    /*registerForm.addEventListener("submit", e => {
        e.preventDefault();
    
        //Perform Registration
        
        setFormMessage(registerForm, "error");
    });*/

    //set requirements on username registration
    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "registerUsername" && e.target.value.length > 0 && e.target.value.length < 8) {
                setInputError(inputElement, "Username must be at least 8 characters long");
            }
        });
        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });

    //set requirements on password registration
    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "registerPassword" && e.target.value.length > 0 && e.target.value.length < 8) {
                setInputError(inputElement, "Password must be at least 8 characters long");
            }
        });
        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});