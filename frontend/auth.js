function signup() {

    const username =
        document.getElementById("signupUsername").value;

    const password =
        document.getElementById("signupPassword").value;

    if (username === "" || password === "") {
        alert("Fill all fields");
        return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    alert("Signup Successful");

    window.location.href = "login.html";
}


function login() {

    const username =
        document.getElementById("loginUsername").value;

    const password =
        document.getElementById("loginPassword").value;

    const savedUser =
        localStorage.getItem("username");

    const savedPass =
        localStorage.getItem("password");

    if (
        username === savedUser &&
        password === savedPass
    ) {
        alert("Login Successful");

        window.location.href = "index.html";
    }
    else {
        alert("Invalid Username or Password");
    }
}