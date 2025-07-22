const passwordbtn = document.getElementById("passwordbtn");
passwordbtn.addEventListener("click", function() {
    const password = document.getElementById("account_password");
    if (password.type === "password") {
        password.type = "text";
        passwordbtn.textContent = "Hide Password";
    } else {
        password.type = "password";
        passwordbtn.textContent = "Show Password";
    }
});