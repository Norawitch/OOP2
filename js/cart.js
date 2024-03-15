var count_login = 0;

// Function to populate accessory details in the cart
function populateAccessoryDetails(accessories) {
    const accessoryDiv = document.getElementById('accessory');

    // Clear existing content
    accessoryDiv.innerHTML = '';

    // Create a container with a fixed height and scrolling
    const accessoryContainer = document.createElement('div');
    accessoryContainer.classList.add('accessory-container');

    // Loop through the first six accessories and create HTML elements for each accessory
    accessories.slice(0, 6).forEach((accessory, index) => {
        const accDiv = document.createElement('div');
        accDiv.classList.add('acc');
        accDiv.style.display = "grid";
        accDiv.style.gridTemplateColumns = "260px 250px 200px 50px"


        const namePara = document.createElement('p');
        namePara.classList.add('name');
        namePara.textContent = `${index + 1}. ${accessory.name}`;

        const idPara = document.createElement('p');
        // idPara.classList.add('id');
        idPara.textContent = accessory.id;

        const pricePara = document.createElement('p');
        pricePara.classList.add('price');
        pricePara.textContent = accessory.price;


        // Create an image element for the close icon
        const closeIcon = document.createElement('img');
        closeIcon.src = '../image/closebutt.png'; // Set the source to your icon image
        closeIcon.alt = 'Close';
        closeIcon.style.width = "24px";
        closeIcon.classList.add('close-icon');
        
        // Add an event listener to the close button
        closeIcon.addEventListener('click', (event) => {
            console.log('Close icon clicked for accessory ID:', accessory.id);
            deleteAccessory(accessory.id); // Call function to delete accessory
            accDiv.remove(); // Remove the accessory element from the DOM
        });

        accDiv.appendChild(namePara);
        accDiv.appendChild(idPara);
        accDiv.appendChild(pricePara);
        accDiv.appendChild(closeIcon);

        accessoryContainer.appendChild(accDiv);
    });

    // Append the container to the accessoryDiv
    accessoryDiv.appendChild(accessoryContainer);
}

// Function to delete accessory
function deleteAccessory(accessoryId) {
    fetch("http://127.0.0.1:8000/del_accessory_in_cart", {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            customer_id: tempCustomerId,
            accessory_id: accessoryId
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Deleted accessory:', data);
        // Handle the response as needed
        alert(`Accessory with ID ${accessoryId} deleted`);
    })
    .catch(error => {
        console.error('Error deleting accessory:', error);
    });
}

// Function get cart
function getCart() {
    fetch("http://localhost:8000/your_shopping_cart", {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            customer_id: tempCustomerId
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Shopping Cart:', data);
        // Handle shopping cart data as needed
        
        populateAccessoryDetails(data.data);
        
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors
    });
}

function confirmOrder() {
    fetch("http://localhost:8000/your_shopping_cart", {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            customer_id: tempCustomerId
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Shopping Cart:', data);
        if (Array.isArray(data.data) && data.data.length === 0) {
            // Empty array
            console.log('Data array is empty');
            alert("Your cart is empty")
        } else {
            // Not an empty array or not an array at all
            
            // confirm order and go to page order
            const date_start = document.getElementById('date-start');
            const date_end = document.getElementById('date-end');
            const dateStartValue = date_start.value.trim();
            const dateEndValue = date_end.value.trim();
            checkdate(dateStartValue, dateEndValue);
            console.log(checkdate)
            if (dateStartValue < dateEndValue === true){
                alert('Your order has been confirmed')
                window.location.href = "order.html";
            }
            else{
                alert('Date Error');
            }
            
            
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors
        alert('Error');
    });
}

function checkdate(date_start, date_end) {
    if (date_start < date_end){
    fetch("http://127.0.0.1:8000/confirm_order", {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            customer_id: tempCustomerId,
            date_start: date_start,
            date_end: date_end,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Shopping Cart:', data);
        // Handle shopping cart data as needed
        return true
        // location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors
        return false
    });
    }
    else{
        // alert("Date input error")
        return false
    }
}


function getName() {
    fetch("http://localhost:8000/search_account_name_by_id", {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            customer_id : tempCustomerId
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Customer:', tempCustomerId);
        // Show name
        // showCart(data.data);
        const name = document.getElementById('customer-name');
        
        name.textContent = data
        name.style.fontFamily = 'Prompt'
        name.style.fontSize = "20px"
        name.style.marginLeft = "50px"
        
        if(tempCustomerId !== undefined){
            const head = document.getElementById('head')
            const order_icon = document.createElement('a');
            const icon = document.createElement('img')
            order_icon.href = "order.html"
            order_icon.style.marginLeft = "20px"
            icon.src = "../image/order.png"
            icon.style.height = "30px"
            order_icon.appendChild(icon)
            head.appendChild(order_icon)

            console.log('Customer name:', data)
            const nameInput = document.querySelector('#input-name'); // Select the input element with class 'name'
            nameInput.value = ` ${data}`; // Set the value of the input field to the name received from the fetch request
            nameInput.readOnly = true;
        }
        else{
            null
        }
        
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors
    });
}

// Add event listener to the member icon
document.getElementById('member-icon').addEventListener('click', function() {
    if (tempCustomerId !== undefined) {
        // Toggle the display of the logout button
        var logoutButton = document.getElementById('logout');
        logoutButton.style.display = logoutButton.style.display === 'none' ? 'block' : 'none';
    } else {
        // Redirect the user to the login page
        window.location.href = "member.html"; // Replace "login.html" with the actual login page URL
    }
});
// Add event listener to the logout button
document.getElementById('logout').addEventListener('click', function() {
    // Reset the customerID cookie
    document.cookie = `customerID=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
});


document.addEventListener('DOMContentLoaded', function() {
    console.log("gatname by:", tempCustomerId)
    getName();
});

document.getElementById('cart').addEventListener('click', function() {
    getCart();
})


var popupCart = document.getElementById('popupCart');

function scroll() {
  if (count === 0) {
    count += 1;
    // Disable any existing overflow styles
    popupCart.style.overflow = '';
  } else {
    count = 0;
    // Implement your desired scrolling behavior here (e.g., scroll to top)
    popupCart.scrollTop = 0; // Scroll to top of the container
  }
}

document.getElementById('make-order').addEventListener('click', function() {
    confirmOrder();
})


    
