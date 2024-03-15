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
        accDiv.style.gridTemplateColumns = "repeat(3, 1fr)"; // Set grid to 3 columns
        // accDiv.style.gap = "60px";

        const namePara = document.createElement('p');
        namePara.classList.add('name');
        namePara.textContent = `${index + 1}. ${accessory.name}`;

        const idPara = document.createElement('p');
        idPara.classList.add('id');
        idPara.textContent = accessory.id;

        const pricePara = document.createElement('p');
        pricePara.classList.add('price');
        pricePara.textContent = accessory.price;

        accDiv.appendChild(namePara);
        accDiv.appendChild(idPara);
        accDiv.appendChild(pricePara);

        accessoryContainer.appendChild(accDiv);
    });


    // Append the container to the accessoryDiv
    accessoryDiv.appendChild(accessoryContainer);

    const total_price = document.getElementById('total-price');
    total_price.textContent = ""
}

function showOrder(orders) {
    var order_array = orders.data;
    const popup1 = document.getElementById('show_order'); // First column
    const popup2 = document.getElementById('show_paid_order'); // Second column

    if (Array.isArray(order_array) && order_array.length > 0) {
        
        let undis_order_count = order_array.length;
        
        order_array.forEach(order => {
            // Create a container for each order
            const orderContainer = document.createElement('div');
            orderContainer.className = 'order-container';
            orderContainer.style.background = '#fff'; // Background color of the card
            orderContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Shadow effect
            orderContainer.style.borderRadius = '10px'; // Rounded corners
            orderContainer.style.padding = '20px'; // Padding inside the card
            orderContainer.style.paddingRight = '30px';
            orderContainer.style.marginBottom = "2rem";
            orderContainer.style.zIndex = '9999';

            // Display order details
            const orderId = document.createElement('p');
            orderId.textContent = `Order ID: ${order['order_id']}`;
            orderId.style.fontWeight = "Bold";
            orderId.style.fontSize = "20px";
            orderContainer.appendChild(orderId);

            const orderStatus = document.createElement('p');
            orderStatus.textContent = `Status: ${order.status}`;
            orderStatus.style.fontSize = "18px";
            orderContainer.appendChild(orderStatus);

            const totalCost = document.createElement('p');
            totalCost.textContent = `Total Cost: ${order.total}`;
            totalCost.style.fontSize = "18px";
            orderContainer.appendChild(totalCost);

            // Create a list to display accessories for each order
            const accessoryList = document.createElement('ul');
            accessoryList.className = 'accessory-list';

            // Populate the list with accessory data for the current order
            order.data.forEach(accessory => {
                const listItem = document.createElement('li');
                const ass_id = document.createElement('li');
                ass_id.textContent = `Accessory ID : ${accessory.id}`;
                const ass_name = document.createElement('li');
                ass_name.textContent = `Name : ${accessory.name}`;
                ass_name.style.listStyleType = "none";
                const ass_price = document.createElement('li');
                ass_price.textContent = `Price : ${accessory.price}`;
                ass_price.style.listStyleType = "none";
                const ass_lenter = document.createElement('li');
                ass_lenter.textContent = `Lenter : ${accessory.lenter}`;
                ass_lenter.style.listStyleType = "none";
                const ass_date = document.createElement('li');
                ass_date.textContent = `Date : ${accessory.date_start} to ${accessory.date_end}`;
                ass_date.style.listStyleType = "none";
                
                listItem.style.marginLeft = "50px";
                listItem.appendChild(ass_id);
                listItem.appendChild(ass_name);
                listItem.appendChild(ass_price);
                listItem.appendChild(ass_lenter);
                listItem.appendChild(ass_date);
                accessoryList.appendChild(listItem);

                // Append the accessory list to the order container
                orderContainer.appendChild(accessoryList);
            });


            
            
            // Append the order container to the appropriate column based on the order status
            if (order.status === "undischarged") {
                // Create pay button
                const payButton = document.createElement('button');
                payButton.className = "pay_order";
                payButton.textContent = "ชำระเงิน";
            
            
                // Create a cancel button
                const cancelButton = document.createElement('button');
                cancelButton.className = "cancel_order";
                cancelButton.textContent = "ยกเลิก";


                
                const button = document.createElement('div');
                button.style.margin = "10px";
                button.appendChild(payButton)
                button.appendChild(cancelButton)
                orderContainer.appendChild(button);

                // Add event listener to the pay button
                payButton.addEventListener('click', function() {
                    payButton.disabled = true;
                    showPopup(order['order_id']);
                });

                // Add event listener to the cancel button
                cancelButton.addEventListener('click', function() {
                cancelButton.disabled = true;
                cancelOrder(order['order_id']); // Pass the cancel button to the cancelOrder function
                // Remove the order container from the DOM
                orderContainer.remove();
                
                location.reload();
            });
                popup1.appendChild(orderContainer); // Append to first column
            } else if (order.status === "Paid") {
                
                popup2.appendChild(orderContainer); // Append to second column

            }
            
            // Decrement undis_order_count only for undischarged orders
            if (order.status === "Paid" || order.status === "canceled") {
                undis_order_count -= 1;
            }
        });

        show_undis_order(undis_order_count);
        
    } else {
        console.error('Orders array is either not an array or empty:', order_array);
    }

}
document.addEventListener('DOMContentLoaded', function() {
    const undis_order = document.getElementById('undis_order');
    const paid_order = document.getElementById('paid_order');

    const ordersContainer = document.querySelector('.column1 #show_order');
    const paidOrdersContainer = document.querySelector('.column2 #show_paid_order');

    undis_order.addEventListener('click', function() {
        // Toggle the visibility of all order containers in the first column
        ordersContainer.classList.toggle('hidden');
    });

    paid_order.addEventListener('click', function() {
        // Toggle the visibility of all paid order containers in the second column
        paidOrdersContainer.classList.toggle('hidden');
    });
});

function showConfirmedOrder() {
    fetch("http://127.0.0.1:8000/check_status_confirmed_order", {
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
        console.log('Order:', data);
        // Handle shopping cart data as needed
        showOrder(data);
    })
    .catch(error => {
        console.error('Order Error:', error);
        // Handle errors
        showOrder('Error');
    }); 
}

// Function to show the popup with animation
function showPopup(order_id) {
    var popupContainer = document.getElementById('popupContainer');
    popupContainer.classList.add('popup-animation'); // Add the CSS class for animation
    popupContainer.style.display = 'block';
    popupContainer.style.opacity = '0'; // Set initial opacity to 0

    // Trigger reflow to ensure CSS transition is applied
    popupContainer.getBoundingClientRect();

    popupContainer.style.opacity = '1'; // Increase opacity to 1 for fade-in effect
    
    const agreeButtons = document.getElementsByClassName('agree_butt');
    for (let i = 0; i < agreeButtons.length; i++) {
        agreeButtons[i].addEventListener('click', function() {
            // create cookie to sent to payment page
            document.cookie = `orderId = ${order_id}`;
            // fast api to confirm order
            location.href = 'payment.html';
        });
    }
    document.body.style.overflow = 'hidden';
}

// Function to close the popup with animation
function closePopup() {
    var popupContainer = document.getElementById('popupContainer');
    popupContainer.classList.add('popup-animation'); // Add the CSS class for animation
    if (popupContainer.style.display === 'block') {
        popupContainer.style.opacity = '0'; // Set opacity to fade out the popup
        setTimeout(() => {
            popupContainer.style.display = 'none'; // Hide the popup after the animation completes
            popupContainer.style.opacity = ''; // Reset opacity for future use
            popupContainer.classList.remove('popup-animation'); // Remove the CSS class
            location.reload();
        }, 300); // Adjust this value to match the transition duration in milliseconds
        
    } else {
        popupContainer.style.opacity = '1'; // Set opacity to fade in the popup
        popupContainer.style.display = 'block'; // Show the popup
    }
    document.body.style.overflow = 'auto';
}

function payOrder(order_id) {
    
    
}

function cancelOrder(order_id) {
    fetch("http://127.0.0.1:8000/cancel_order", {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            customer_id: tempCustomerId,
            order_id: order_id
        }),
    })
    .then(response => response.json())
    .then(data => {
        // console.log('Order:', data);
        alert(`Order id ${order_id} has been remove from your cart`)
    })
    .catch(error => {
        console.error('Cancle order Error:', error);
        showOrder('Error');
    }); 
}



function show_undis_order(num) {
    const show_text = document.getElementById('undis_order');
    show_text.textContent = `รอการชำระเงิน ${num} รายการ`; // Display the count in the button text
}


document.addEventListener('DOMContentLoaded', function() {
    const undis_order = document.getElementById('undis_order');
    const ordersContainer = document.getElementById('show_order');

    undis_order.addEventListener('click', function() {
        // Toggle the visibility of all order containers
        const orders = ordersContainer.querySelectorAll('.order-container');
        orders.forEach(order => {
            order.classList.toggle('hidden');
        });
    });
    
    const paid_order = document.getElementById('paid_order');
    const ordersContainerPaid = document.getElementById('paid_order');
    undis_order.addEventListener('click', function() {
        // Toggle the visibility of all order containers
        const orders = ordersContainerPaid.querySelectorAll('.order-container');
        orders.forEach(order => {
            order.classList.toggle('hidden');
        });
    });

});

document.addEventListener('DOMContentLoaded', function() {
    showConfirmedOrder();
});
