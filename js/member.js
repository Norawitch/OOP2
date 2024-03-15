function openPopupContract() {
    let popupContract = document.getElementById('popupContract');
    popupContract.style.display = 'block';
}

function closePopupContract() {
    let popupContract = document.getElementById('popupContract');
    popupContract.style.display = 'none';
}

function openPopupPrivacy() {
    let popupPrivacy = document.getElementById('popupPrivacy');
    popupPrivacy.style.display = 'block';
}

function closePopupPrivacy() {
    let popupPrivacy = document.getElementById('popupPrivacy');
    popupPrivacy.style.display = 'none';
}

function openPopupCart() {
    let popupCart = document.getElementById('popupCart');
    popupCart.style.display = 'block';
}

function closePopupCart() {
    let popupCart = document.getElementById('popupCart');
    popupCart.style.display = 'none';
}

function openLogout() {
    let popupLogout = document.getElementById('logout');
    if(popupLogout.style.display == 'none'){
        popupLogout.style.display = 'block';
    }
    else{
        popupLogout.style.display = 'none';
    }
}

// Get the cookie string
let cookieString = document.cookie;

// Split the cookie string by semicolons to get an array of key-value pairs
let cookieArray = cookieString.split(';');
let tempCustomerId;
let tempOrderId;
// Iterate through the array to find the desired cookies
cookieArray.forEach(cookie => {
    let [name, value] = cookie.split('=');
    // Trim any leading or trailing whitespace from the name
    name = name.trim();
    if (name === 'customerID') {
        tempCustomerId = value.trim();
    } else if (name === 'orderId') {
        tempOrderId = value.trim();
    }
});


// Function to show a popup
function showPopup(message) {
    // Create a popup element
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;

        // Apply styles to the popup
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.background = 'rgba(0, 0, 0, 0.8)';
        popup.style.color = '#fff';
        popup.style.padding = '10px';
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '9999';

    // Append the popup to the body
    document.body.appendChild(popup);

    // Remove the popup after a delay
    setTimeout(() => {
        popup.remove();
    }, 1500); // 1.5 seconds
}

function getCustomer(email, password) {
    fetch("http://127.0.0.1:8000/search_customer_by_email_password", {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Login:', data);
        if (data && data.data === "Wrong email or password") {
            throw new Error(data.data);
        } else {
            const customer_id = data.data
            document.cookie = `customerID=${customer_id}`;
            window.location.href = '../html/main.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors
        showPopup(error.message || "Error occurred");
        alert()
    });
}

function newRegister(name, tel, address, email, password) {
    fetch("http://127.0.0.1:8000/register", {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            tel: tel,
            address: address,
            email: email,
            password: password
        }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.data);
        window.location.href = 'main.html'
    })
    .catch(error => {
        console.error('Registration Error:', error);
        alert('An error occurred during registration. Please try again later.');
    }); 
}


document.addEventListener('DOMContentLoaded', function() {
    // Get the login button
    const loginButton = document.getElementById('login');

    // Add event listener for login button click
    loginButton.addEventListener('click', function() {
        // Get the login form
        // const loginForm = document.getElementById('loginForm');

        // Retrieve email and password from the form inputs
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Call the getCustomer function with the email and password
        getCustomer(email, password);
        location.reload();
    });

    const registerButton = document.getElementById('register');
    registerButton.addEventListener('click', function() {
    const name = document.getElementById('regis_name').value;
    const tel = document.getElementById('regis_telephone').value;
    const address = document.getElementById('regis_address').value;
    const email = document.getElementById('regis_email').value;
    const password = document.getElementById('regis_password').value;
    const re_password = document.getElementById('re_regis_password').value;

    // Check if any field is empty
    if (name === '' || tel === '' || address === '' || email === '' || password === '' || re_password === '') {
        alert("Please fill all the fields.");
        return; // Exit the function if any field is empty
    }

    // Check if password matches re-entered password
    if (password !== re_password) {
        alert("Passwords do not match.");
        return; // Exit the function if passwords don't match
    }

    // If all checks pass, proceed with registration
    newRegister(name, tel, address, email, password);
});
});

// Function to show the popup with animation
function openPopupPrivacy() {
    var popupContainer = document.getElementById('popupPrivacy');
    popupContainer.classList.add('popup-animation'); // Add the CSS class for animation
    popupContainer.style.display = 'block';
    popupContainer.style.opacity = '0'; // Set initial opacity to 0

    // Trigger reflow to ensure CSS transition is applied
    popupContainer.getBoundingClientRect();

    popupContainer.style.opacity = '1'; // Increase opacity to 1 for fade-in effect
    document.body.style.overflow = 'hidden';

    // Disable the REGISTER button
    var registerButton = document.querySelector('input[type="submit"][value="REGISTER"]');
    registerButton.disabled = true;
}

// Function to close the popup with animation
function closePopupPrivacy() {
    var popupContainer = document.getElementById('popupPrivacy');
    popupContainer.classList.add('popup-animation'); // Add the CSS class for animation
    if (popupContainer.style.display === 'block') {
        popupContainer.style.opacity = '0'; // Set opacity to fade out the popup
        setTimeout(() => {
            popupContainer.style.display = 'none'; // Hide the popup after the animation completes
            popupContainer.style.opacity = ''; // Reset opacity for future use
            popupContainer.classList.remove('popup-animation'); // Remove the CSS class
        }, 300); // Adjust this value to match the transition duration in milliseconds
        document.body.style.overflow = '';
        var registerButton = document.querySelector('input[type="submit"][value="REGISTER"]');
        registerButton.disabled = false;
    } else {
        popupContainer.style.opacity = '1'; // Set opacity to fade in the popup
        popupContainer.style.display = 'block'; // Show the popup
    }
}
