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
// Function to delete a cookie by setting its expiration date to the past
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

document.addEventListener('DOMContentLoaded', function() {
    // Check if the current page is not "payment.html"
    if (window.location.pathname !== "/payment.html") {
        // Delete the "orderId" cookie
        deleteCookie('orderId');
    }
})

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
    document.body.style.overflow = 'hidden';
}

function closePopupCart() {
    let popupCart = document.getElementById('popupCart');
    popupCart.style.display = 'none';
    document.body.style.overflow = '';
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


function openLogout() {
    let popupLogout = document.getElementById('logout');
    if(popupLogout.style.display == 'none'){
        popupLogout.style.display = 'block';
    }
    else{
        popupLogout.style.display = 'none';
    }
}


// Add event listener to the member icon
document.getElementById('member-icon').addEventListener('click', function() {
    if (tempCustomerId !== undefined) {
        // Toggle the display of the logout button
        var logoutButton = document.getElementById('logout');
        logoutButton.style.display = logoutButton.style.display === 'none' ? 'block' : 'none';
        document.cookie = `customerID=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    } else {
        // Redirect the user to the login page
        window.location.href = "member.html"; // Replace "login.html" with the actual login page URL
    }
});

// Function to add an accessory to the cart
function addToCart(tempCustomerId, accessoryId) {
    if (tempCustomerId !== undefined) {
        // Fetch the current contents of the cart
        fetch('http://localhost:8000/your_shopping_cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customer_id: tempCustomerId,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Cart contents:', data);
            // Check if data.data is an array
            if (Array.isArray(data.data)) {
                const accessoryAlreadyInCart = data.data.some(item => item.id === accessoryId);
                if (accessoryAlreadyInCart) {
                    // Show a popup indicating that the accessory is already in the cart
                    alert('This accessory is already in the cart.');
                } else {
                    // If the accessory is not already in the cart, add it
                    fetch('http://localhost:8000/add_to_cart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            customer_id: tempCustomerId,
                            accessory_id: accessoryId,
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Response:', data);
                        // Show a success popup
                        alert('Added to cart successfully');
                    })
                    .catch(error => {
                        console.error('Error adding to cart:', error);
                        // Show an error popup
                        alert('Error adding to cart');
                    });
                }
            } else {
                console.error('Invalid cart data:', data);
                // Show an error popup or handle accordingly
                alert('Invalid cart data. Please try again later.');
            }
        })
        .catch(error => {
            console.error('Error fetching cart:', error);
            // Show an error popup
            alert('Error fetching cart');
        });
    } else {
        // If tempCustomerId is undefined, redirect the user to another HTML page
        window.location.href = "member.html";
    }
}



document.getElementById('add-to-cart').addEventListener('click', function() {
    if(tempCustomerId === undefined){
        window.location.href = "member.html";
    }
    else{
        const accessoryId = urlParams.get('accessory_id');
        addToCart(tempCustomerId, accessoryId);
    }
});
