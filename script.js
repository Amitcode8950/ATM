let users = [];
let currentUser = null;
let currentLanguage = 'en';

function switchLanguage(language) {
    currentLanguage = language;
    const elements = document.querySelectorAll('[data-en]');
    elements.forEach(element => {
        const enText = element.getAttribute('data-en');
        const hiText = element.getAttribute('data-hi');
        if (language === 'hi') {
            element.innerText = hiText;
        } else {
            element.innerText = enText;
        }
    });
}

function alertMessage(messageKey) {
    const messages = {
        en: {
            signupSuccess: "Sign-up successful! Please log in.",
            usernameExists: "Username already exists!",
            passwordsDoNotMatch: "Passwords do not match!",
            invalidLogin: "Invalid username or password.",
            loginSuccess: "Login successful!",
            invalidAmount: "Invalid amount.",
            insufficientFunds: "Insufficient funds.",
            depositSuccess: "Deposited successfully.",
            withdrawSuccess: "Withdrew successfully.",
            pinChangeSuccess: "PIN changed successfully!",
            invalidPin: "Invalid PIN.",
            transactionHistory: "Transaction History",
            passwordResetSuccess: "Password reset successfully!"
        },
        hi: {
            signupSuccess: "साइन अप सफल! कृपया लॉगिन करें।",
            usernameExists: "यूज़रनेम पहले से मौजूद है!",
            passwordsDoNotMatch: "पासवर्ड मेल नहीं खाते!",
            invalidLogin: "अमान्य यूज़रनेम या पासवर्ड।",
            loginSuccess: "लॉगिन सफल!",
            invalidAmount: "अमान्य राशि।",
            insufficientFunds: "पर्याप्त धन नहीं है।",
            depositSuccess: "सफलतापूर्वक जमा किया गया।",
            withdrawSuccess: "सफलतापूर्वक निकासी की गई।",
            pinChangeSuccess: "पिन सफलतापूर्वक बदला गया!",
            invalidPin: "अमान्य पिन।",
            transactionHistory: "लेन-देन इतिहास",
            passwordResetSuccess: "पासवर्ड सफलतापूर्वक रीसेट किया गया!"
        }
    };
    return messages[currentLanguage][messageKey];
}

// Sign-up process
function signUp() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const pin = document.getElementById('signup-pin').value;
    const dob = document.getElementById('signup-dob').value;

    // Date of Birth check
    if (!dob) {
        alert("Please select your date of birth.");
        return;
    }

    const birthDate = new Date(dob);
    const age = calculateAge(birthDate);
    if (age < 18) {
        alert("You must be at least 18 years old to sign up.");
        return;
    }

    if (password !== confirmPassword) {
        alert(alertMessage('passwordsDoNotMatch'));
        return;
    }

    if (pin.length !== 4 || isNaN(pin)) {
        alert("PIN must be a 4-digit number.");
        return;
    }

    const userExists = users.some(user => user.username === username);
    if (userExists) {
        alert(alertMessage('usernameExists'));
        return;
    }

    const newUser = { username, password, pin, balance: 0, transactionHistory: [], dob };
    users.push(newUser);
    alert(alertMessage('signupSuccess'));
    switchToLogin();
}

// Age calculation
function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Login process
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        currentUser = user;
        alert(alertMessage('loginSuccess'));
        switchToATM();
    } else {
        alert(alertMessage('invalidLogin'));
    }
}

// Forgot password process
function forgotPassword() {
    const username = document.getElementById('login-username').value;
    const user = users.find(user => user.username === username);

    if (user) {
        const newPassword = prompt("Enter your new password:");
        if (newPassword) {
            user.password = newPassword;
            alert(alertMessage('passwordResetSuccess'));
        }
    } else {
        alert("User not found.");
    }
}

// Switch between sections
function switchToSignUp() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('signup-section').style.display = 'block';
}

function switchToLogin() {
    document.getElementById('signup-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
}

function switchToATM() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('atm-section').style.display = 'block';
}

// ATM functions
function showBalance() {
    document.getElementById('atm-output').textContent = `Balance: ₹${currentUser.balance}`;
}

function depositMoney() {
    const pin = prompt("Enter your PIN:");
    if (pin !== currentUser.pin) {
        alert("Incorrect PIN.");
        return;
    }

    const amount = prompt("Enter amount to deposit:");
    if (amount && !isNaN(amount) && amount > 0) {
        currentUser.balance += parseFloat(amount);
        alert(`Deposited ₹${amount}. New balance: ₹${currentUser.balance}`);
    } else {
        alert("Invalid amount.");
    }
}

function withdrawMoney() {
    const pin = prompt("Enter your PIN:");
    if (pin !== currentUser.pin) {
        alert("Incorrect PIN.");
        return;
    }

    const amount = prompt("Enter amount to withdraw:");
    if (amount && !isNaN(amount) && amount > 0 && amount <= currentUser.balance) {
        currentUser.balance -= parseFloat(amount);
        alert(`Withdrew ₹${amount}. New balance: ₹${currentUser.balance}`);
    } else {
        alert("Insufficient funds.");
    }
}

function changePin() {
    const currentPin = prompt("Enter your current PIN:");
    if (currentPin === currentUser.pin) {
        const newPin = prompt("Enter new PIN (4 digits):");
        if (newPin.length === 4) {
            currentUser.pin = newPin;
            alert("PIN changed successfully!");
        } else {
            alert("Invalid PIN.");
        }
    } else {
        alert("Invalid PIN.");
    }
}

function showHistory() {
    document.getElementById('atm-output').textContent = `Transaction History: \n` + currentUser.transactionHistory.join("\n");
}

function logout() {
    currentUser = null;
    alert("Logged out successfully.");
    document.getElementById('atm-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('signup-section').style.display = 'block';
}
