// Show Register Form
function showRegisterForm() {
    document.getElementById('register').style.display = 'block';
    document.getElementById('login').style.display = 'none';
    document.getElementById('password-manager').style.display = 'none';
    document.getElementById('hero').style.display = 'none';
}

// Show Login Form
function showLoginForm() {
    document.getElementById('login').style.display = 'block';
    document.getElementById('register').style.display = 'none';
    document.getElementById('password-manager').style.display = 'none';
    document.getElementById('hero').style.display = 'none';
}

// Return Home
function returnHome() {
    document.getElementById('register').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('password-manager').style.display = 'none';
    document.getElementById('hero').style.display = 'block';
}
// Register User
function registerUser(event) {
    event.preventDefault();
    if (localStorage.getItem("user")) {
        alert("Only one user allowed on this system!");
        return;
    }

    let username = document.getElementById("register-username").value;
    let password = document.getElementById("register-password").value;


    // Encrypt password and store user
    let encryptedPassword = CryptoJS.AES.encrypt(password, "mySecretKey").toString();
    localStorage.setItem("user", JSON.stringify({ username, password: encryptedPassword }));

    alert("Registration successful! Please log in.");
    showLoginForm();
}
// Validate Login
function validateLogin(event) {
    event.preventDefault();
    
    let username = document.getElementById('login-username').value;
    let password = document.getElementById('login-password').value;

    if (!username || !password) {
        alert("Username and Password cannot be empty.");
        return;
    }

    localStorage.setItem("loggedInUser", username);
    alert("Login successful!");
    showPasswordManager();
}

// Show Password Manager
function showPasswordManager() {
    document.getElementById('password-manager').style.display = 'block';
    document.getElementById('login').style.display = 'none';
    document.getElementById('hero').style.display = 'none';
    document.getElementById('logout').style.display = 'block';
    loadPasswords();
}

//password strength checker
function validatePasswordStrength(password) {
    let strengthMessage = "Weak Password";
    let strengthColor = "red";
    
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
        strengthMessage = "Strong Password";
        strengthColor = "green";
    } else if (password.length >= 6) {
        strengthMessage = "Medium Password";
        strengthColor = "orange";
    }
    
    let strengthIndicator = document.getElementById("password-strength");
    strengthIndicator.textContent = strengthMessage;
    strengthIndicator.style.color = strengthColor;
}

// Logout
function logout() {
    localStorage.removeItem("loggedInUser");
    alert("You have been logged out.");
    returnHome();
}

// Save Password (AES Encryption)
function encryptPassword(password) {
    return CryptoJS.AES.encrypt(password, "mySecretKey").toString();
}

function decryptPassword(encryptedPassword) {
    let bytes = CryptoJS.AES.decrypt(encryptedPassword, "mySecretKey");
    return bytes.toString(CryptoJS.enc.Utf8);
}

function savePassword() {
    let site = document.getElementById("site").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        alert("You must be logged in to save passwords.");
        return;
    }

    if (!site || !username || !password) {
        alert("All fields are required!");
        return;
    }

    let encryptedPassword = encryptPassword(password);
    let userPasswords = JSON.parse(localStorage.getItem("passwords")) || {};

    if (!userPasswords[loggedInUser]) {
        userPasswords[loggedInUser] = []; // Initialize if user has no saved passwords
    }

    userPasswords[loggedInUser].push({ site, username, password: encryptedPassword });

    localStorage.setItem("passwords", JSON.stringify(userPasswords));

    alert("Password saved successfully!");
    loadPasswords();
}

// Load Passwords
function loadPasswords() {
    let passwordList = document.getElementById("passwordList");
    passwordList.innerHTML = "";

    let passwords = JSON.parse(localStorage.getItem("passwords")) || [];

    passwords.forEach((item, index) => {
        let decryptedPassword = decryptPassword(item.password);
        let row = `
            <tr>
                <td>${item.site}</td>
                <td>${item.username}</td>
                <td><span id="password-${index}" class="hidden-password">********</span>
                    <button onclick="togglePassword(${index}, '${decryptedPassword}')">Show</button>
                </td>
                <td>
                    <button onclick="copyPassword('${decryptedPassword}')">Copy</button>
                    <button onclick="deletePassword(${index})">Delete</button>
                </td>
            </tr>
        `;
        passwordList.innerHTML += row;
    });
}

// Toggle Password Visibility
function togglePassword(index, password) {
    let passwordSpan = document.getElementById(`password-${index}`);
    passwordSpan.textContent = passwordSpan.textContent === "********" ? password : "********";
}

// Copy Password
function copyPassword(password) {
    navigator.clipboard.writeText(password).then(() => {
        alert("Password copied to clipboard!");
    });
}

// Delete Password
function deletePassword(index) {
    let passwords = JSON.parse(localStorage.getItem("passwords")) || [];
    passwords.splice(index, 1);
    localStorage.setItem("passwords", JSON.stringify(passwords));
    loadPasswords();
}
