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
console.log("TempCus: ",tempCustomerId)
console.log("TempOrder: ",tempOrderId)

// -------------------------------------------------------

let current_order;
function showConfirmedOrder() {
    fetch("http://127.0.0.1:8000/search_order_by_id", {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            order_id: tempOrderId
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Order:', data);
        // Handle shopping cart data as needed
        // showOrder(data);
        current_order = data;
    })
    .catch(error => {
        console.error('Order Error:', error);
        // Handle errors
        // showOrder('Error');
    }); 
}

// -------------------------------------------------------
let selectedValue;
function getAccInfo() {
    fetch("http://127.0.0.1:8000/search_account_info_by_id", {
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
        console.log(data.address)
        console.log(data.email)
        const addressInput = document.querySelector('#input-address'); // Select the input element with class 'name'
        addressInput.value = ` ${data.address}`; // Set the value of the input field to the name received from the fetch request
        addressInput.readOnly = true;
        const emailInput = document.querySelector('#input-email');
        emailInput.value = ` ${data.email}`;
        emailInput.readOnly = true;
    })
}
document.addEventListener('DOMContentLoaded', function() {
    getAccInfo();
    showConfirmedOrder();
    selectedValue = 'none'
    console.log("Selected value: ", selectedValue)
    const selectElement = document.getElementById('payment_type'); // Get the select element by its ID
    selectElement.addEventListener('change', function() {
        selectedValue = selectElement.value; // Update selectedValue when payment type changes
        console.log("Selected value: ", selectedValue);
    });
});

// -------------------------------------------------------

const paymentTypeSelect = document.getElementById('payment_type');
const cardDetailsDiv = document.getElementById('card_details');

paymentTypeSelect.addEventListener('change', function() {
    if (paymentTypeSelect.value === 'Prompt-Pay' || paymentTypeSelect.value === 'Cash') {
        cardDetailsDiv.style.display = 'none';
    } else {
        cardDetailsDiv.style.display = 'block';
    }
});

// -------------------------------------------------------

function payment(card_number, exp_date, cvv, total){
    fetch("http://127.0.0.1:8000/payment", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            customer_id: `${tempCustomerId}`,
            payment_type: `${selectedValue}`,
            payment_detail: JSON.stringify({
                card_number: `${card_number}`,
                expiration_date: `${exp_date}`,
                CVV: `${cvv}`
            }),
            order_id: tempOrderId,
            amount: total
        }),
    })
    .then(response => response.json())
    .then(data => {
        
        alert(`Your Order ${tempOrderId} has been paid by ${selectedValue}`)
    })
    .catch(error => {
        console.error('Order Error:', error);
        // Handle errors

    }); 
}
// function pay(){
//     alert(`Your Order ${tempOrderId} has been paid by ${selectedValue}`)
// }
document.getElementById('pay_now_button').addEventListener('click', function() {
    const total = current_order.total
    let card_number = ""
    let exp_date = ""
    let cvv = ""
    if(selectedValue !== 'Card' && selectedValue !== 'none'){
        payment(card_number, exp_date, cvv, total);
    }else if (selectedValue === 'Card'){
        const card_num_input = document.getElementById('card_number').value
        const exp_date_input = document.getElementById('exp_date').value
        const card_cvv_input = document.getElementById('CVV').value
        if(card_num_input !== '' && exp_date_input !== '' && card_cvv_input !== ''){
            alert('sure')
            card_number = document.getElementById('card_number').value
            exp_date = document.getElementById('exp_date').value
            cvv = document.getElementById('CVV').value
            
            console.log("Variable pay:", card_number)
            console.log("Variable pay:", exp_date)
            console.log("Variable pay:", cvv)
            console.log("Variable pay:", total)
            // payment(card_number, exp_date, cvv, total);
            payment(card_number="12", exp_date="2024-03-18", cvv="18", total);
        }else{
            alert('Plese complete information before submit')
        }
    }
});
