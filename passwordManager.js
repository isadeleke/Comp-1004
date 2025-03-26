// Show Register Form
function showRegisterForm() {
    document.getElementById('register').style.display = 'block';
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('hero').style.display = 'none';
}

// Show Login Form
function showLoginForm() {
    document.getElementById('login').style.display = 'block';
    document.getElementById('register').style.display = 'none';
    document.getElementById('password-manager').style.display = 'none';
    document.getElementById('hero').style.display = 'none';
}

function returnHome() {
    document.getElementById('register').style.display = 'none';
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('store-password-section').style.display = 'none';
    document.getElementById('retrieve-password-section').style.display = 'none';
    document.getElementById('hero').style.display = 'block';
    
     // Clear login form fields when returning home
     document.getElementById("login-username").value = "";
     document.getElementById("login-password").value = "";
    
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

    let username = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;

    let storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
        alert("No registered user found! Please register first.");
        showRegisterForm();
        return;
    }

    let decryptedPassword = CryptoJS.AES.decrypt(storedUser.password, "mySecretKey").toString(CryptoJS.enc.Utf8);

    if (username === storedUser.username && password === decryptedPassword) {
        sessionStorage.setItem("loggedIn", "true");
        alert("Login successful!");
        /*document.getElementById("hero").style.display = "none";
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block'; // Show Dashboard*/
        document.getElementById("logout").style.display = "inline";
        document.getElementById("login-btn").style.display = "none";
        document.getElementById("home-btn").style.display = "none";

        
        showSection("dashboard-section");
        //document.getElementById("logout-btn").style.display = "block";
    } else {
        alert("Invalid credentials!");
    }
}
// Show Password Manager
function showPasswordManager() {
    if (sessionStorage.getItem("loggedIn") !== "true") {
        alert("Please log in first!");
        showSection("login-section");
        return;
    }

    showSection("retrieve-password-section");
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('hero').style.display = 'none';
    document.getElementById('logout').style.display = 'block';
    updatePasswordList();; // Load saved passwords
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

function savePassword(event) {
    event.preventDefault();

    const site = document.getElementById("site").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const currentUser = sessionStorage.getItem("username");
    const encryptionKey = sessionStorage.getItem("key");

    let allPasswords = JSON.parse(localStorage.getItem("passwords")) || {};
    if (!allPasswords[currentUser]) {
        allPasswords[currentUser] = [];
    }

    const encryptedPassword = CryptoJS.AES.encrypt(password, encryptionKey).toString();

    allPasswords[currentUser].push({ site, username, password: encryptedPassword });

    localStorage.setItem("passwords", JSON.stringify(allPasswords));

    alert("Password saved!");
    showSection("dashboard-section");
}

// Load Passwords
function updatePasswordList() {
    let passwordList = document.getElementById("passwordList");
    let tableHeader = document.querySelector("table thead");
    let storedPasswords = JSON.parse(localStorage.getItem("passwords")) || [];

    // Clear previous content
    passwordList.innerHTML = "";

    if (storedPasswords.length === 0) {
        tableHeader.style.display = "none"; // Hide table header if no passwords exist
        passwordList.innerHTML = `<tr><td colspan="4">No saved passwords available.</td></tr>`;
    } else {
        tableHeader.style.display = "table-header-group"; // Show header if passwords exist
        storedPasswords.forEach((entry, index) => {
            let decryptedPassword = CryptoJS.AES.decrypt(entry.password, "mySecretKey").toString(CryptoJS.enc.Utf8);
            let row = ` 
                <tr>
                    <td>${entry.site}</td>
                    <td>${entry.username}</td>
                    <td>
                        <span id="password-${index}" class="hidden-password">********</span>
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
    
    if (confirm("Are you sure you want to delete this password?")) {
        passwords.splice(index, 1);
        localStorage.setItem("passwords", JSON.stringify(passwords));
        //loadPasswords(); // Refresh the table
        updatePasswordList(); // Refresh table
    }
}
function showSection(sectionId) {
    const sections = [
        "hero",
        "login-section",
        "register",
        "dashboard-section",
        "store-password-section",
        "retrieve-password-section"
    ];

    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = (id === sectionId) ? "block" : "none";
        }
    });

    // Save the last viewed section in sessionStorage
    sessionStorage.setItem("lastSection", sectionId);

    // Also control visibility of login/register/logout links
    //const loggedIn = sessionStorage.getItem("loggedIn") === "true";
    //document.querySelector("nav a[onclick='showLoginForm()']").style.display = loggedIn ? "none" : "inline";
    //document.querySelector("nav a[onclick='showRegisterForm()']").style.display = loggedIn ? "none" : "inline";
    //document.getElementById("logout").style.display = loggedIn ? "inline" : "none";
}
