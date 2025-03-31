// Show Register Form
function showRegisterForm() {
    document.getElementById('register').style.display = 'block';
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('hero').style.display = 'none';
}

// Show Login Form
function showLoginForm() {
    let loginSection = document.getElementById('login-section');
    let registerSection = document.getElementById('register');
    let passwordManager = document.getElementById('dashboard-section');
    let heroSection = document.getElementById('hero');

    //  Debugging - Check if elements exist before changing their styles
    if (!loginSection) {
        console.error("Error: 'login-section' not found in the document.");
        return; // Stop execution if element doesn't exist
    }

    if (!registerSection) {
        console.error("Error: 'register' section not found.");
    }

    if (!passwordManager) {
        console.error("Error: 'password-manager' section not found.");
    }

    if (!heroSection) {
        console.error("Error: 'hero' section not found.");
    }

    //  Now safely change visibility
    loginSection.style.display = 'block';
    if (registerSection) registerSection.style.display = 'none';
    if (passwordManager) passwordManager.style.display = 'none';
    if (heroSection) heroSection.style.display = 'none';

     // Clear login form fields when returning home
     document.getElementById("login-username").value = "";
     document.getElementById("login-password").value = "";
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

    const username = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(user => user.username === username)) {
        alert("Username already exists!");
        return;
    }

    const encryptedPassword = CryptoJS.AES.encrypt(password, "mySecretKey").toString();
    users.push({ username, password: encryptedPassword });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful!");
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
function checkLoginStatus() {
    let loggedIn = sessionStorage.getItem("loggedIn") || localStorage.getItem("loggedIn");
    let logoutButton = document.getElementById("logout");
    let loginLink = document.querySelector("nav a[href='#'][onclick='showLoginForm()']");
    let registerLink = document.querySelector("nav a[href='#'][onclick='showRegisterForm()']");

    if (loggedIn === "true") {
        // Hide login & register links
        document.querySelector("nav a[href='#'][onclick='showLoginForm()']").style.display = "none";
        //document.querySelector("nav a[href='#'][onclick='showRegisterForm()']").style.display = "none";
        
        // Show logout button
        document.getElementById("logout").style.display = "inline";
        

        // Redirect to dashboard
        showSection("dashboard-section");
    } else {
        showSection("hero");
        // Show login & register links
        //document.querySelector("nav a[href='#'][onclick='showLoginForm()']").style.display = "inline";
        //document.querySelector("nav a[href='#'][onclick='showRegisterForm()']").style.display = "inline";

        // Redirect to login section
        document.getElementById("login-btn").style.display = "inline";

        // Hide logout button
        document.getElementById("logout").style.display = "none";

        
        
    }
}
function exportPasswords() {
    const passwords = JSON.parse(localStorage.getItem("passwords")) || [];

    if (passwords.length === 0) {
        alert("No passwords to export!");
        return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    let enteredPassword;

    while (true) {
        enteredPassword = prompt("Enter your account password to export passwords (Cancel to abort):");
        
        if (enteredPassword === null) { // User clicked Cancel
            alert("Password export cancelled.");
            return;
        }

        try {
            const decryptedStoredPassword = CryptoJS.AES.decrypt(storedUser.password, "mySecretKey").toString(CryptoJS.enc.Utf8);

            if (enteredPassword === decryptedStoredPassword) {
                break; // Correct password, proceed
            } else {
                alert("Incorrect password! Please try again.");
            }
        } catch (e) {
            alert("Incorrect password or corrupted data! Please try again.");
        }
    }

    // Encrypt passwords clearly with the user's entered password before export for security
    const encryptedPasswords = CryptoJS.AES.encrypt(JSON.stringify(passwords), enteredPassword).toString();

    const data = { passwords: encryptedPasswords };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "encrypted_passwords.json";// allow user to download JSON file
    a.click();
    URL.revokeObjectURL(url);

    // Clear passwords after successful export clearly
    localStorage.removeItem("passwords"); 
    alert("Passwords exported successfully and cleared from local storage!");

    updatePasswordList();
}
function importPasswords(event) {
    const file = event.target.files[0];

    if (!file) {
        alert("No file selected!");
        return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    let enteredPassword;

    while (true) {
        enteredPassword = prompt("Enter your account password to import passwords (Cancel to abort):");
        
        if (enteredPassword === null) { // user clicked Cancel
            alert("Password import cancelled.");
            event.target.value = "";
            return;
        }

        try {
            const decryptedStoredPassword = CryptoJS.AES.decrypt(storedUser.password, "mySecretKey").toString(CryptoJS.enc.Utf8);

            if (enteredPassword === decryptedStoredPassword) {
                break; // Correct password entered, proceed
            } else {
                alert("Incorrect password! Please try again.");
            }
        } catch (e) {
            alert("Incorrect password or corrupted data! Please try again.");
        }
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            const decryptedPasswords = JSON.parse(CryptoJS.AES.decrypt(importedData.passwords, enteredPassword).toString(CryptoJS.enc.Utf8));

            if (!Array.isArray(decryptedPasswords)) {
                throw new Error("Invalid file format");
            }

            localStorage.setItem("passwords", JSON.stringify(decryptedPasswords));

            alert("Passwords imported successfully!");
            updatePasswordList();
        } catch (error) {
            alert("Import failed: Incorrect password or corrupted file!");
        }

        event.target.value = "";
    };

    reader.readAsText(file);
}
window.onload = function () {
    const loggedIn = sessionStorage.getItem("loggedIn") === "true";
    const lastSection = sessionStorage.getItem("lastSection");

     // Update nav bar
     if (loggedIn) {
        document.getElementById("login-btn").style.display = "none";
        //document.getElementById("nav-register").style.display = "none";
        document.getElementById("logout").style.display = "inline";
    } else {
        document.getElementById("login-btn").style.display = "inline";
        //document.getElementById("nav-register").style.display = "inline";
        document.getElementById("logout").style.display = "none";
    }
    document.getElementById("home-btn").style.display = loggedIn ? "none" : "inline";

    // Restore section
    if (loggedIn && lastSection) {
        showSection(lastSection);
    } else {
        showSection("hero");
    }

    // 🧠 Update navbar links correctly
    document.getElementById("login-btn").style.display = loggedIn ? "none" : "inline";
    //document.getElementById("nav-register").style.display = loggedIn ? "none" : "inline";
    document.getElementById("logout").style.display = loggedIn ? "inline" : "none";

    updatePasswordList(); // optional
};
