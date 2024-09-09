// Initialize prices (in Rupiah)
const prices = [10000, 12000, 5000, 3000, 7000]; // Bakso, Mie Ayam, Kebab, Es Teh, Buavita

// Dish Elements (Array to store all quantity and total price elements)
const quantities = [
    document.getElementById('quantity1'),
    document.getElementById('quantity2'),
    document.getElementById('quantity3'),
    document.getElementById('quantity4'),
    document.getElementById('quantity5')
];

const totalPrices = [
    document.getElementById('totalPrice1'),
    document.getElementById('totalPrice2'),
    document.getElementById('totalPrice3'),
    document.getElementById('totalPrice4'),
    document.getElementById('totalPrice5')
];

// Grand Total
let grandTotal = document.getElementById('grandTotal');

// Function to format number to Rupiah with commas
function formatToRupiah(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Update total price for a specific item
function updateItemTotal(index) {
    let quantity = parseInt(quantities[index].textContent);
    let total = quantity * prices[index];
    totalPrices[index].textContent = formatToRupiah(total);

    // Update grand total after each change
    updateGrandTotal();
}

// Grand Total Calculation
function updateGrandTotal() {
    let total = 0;
    for (let i = 0; i < totalPrices.length; i++) {
        total += parseInt(totalPrices[i].textContent.replace(/\./g, '')) || 0;
    }
    grandTotal.textContent = formatToRupiah(total);
}

// Attach event listeners to increase and decrease buttons
document.querySelectorAll('.menu-item').forEach((menuItem, index) => {
    // Increase button
    menuItem.querySelector('.increase').addEventListener('click', function() {
        quantities[index].textContent = parseInt(quantities[index].textContent) + 1;
        updateItemTotal(index);
    });

    // Decrease button
    menuItem.querySelector('.decrease').addEventListener('click', function() {
        if (parseInt(quantities[index].textContent) > 0) {
            quantities[index].textContent = parseInt(quantities[index].textContent) - 1;
            updateItemTotal(index);
        }
    });
});

// Order Button Event Listener
document.getElementById('order-btn').addEventListener('click', function() {
    // Get customer name and email
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;

    // Check if the name and email are entered
    if (customerName === "" || customerEmail === "") {
        alert("Please enter your name and email.");
        return;
    }

    // Simulate sending order confirmation
    alert(`Terima Kasih, ${customerName}! Pesanan anda telah berhasil dilakukan. Jika ada yang ingin dipesan, lakukan pemesanan ulang.`);
    
    // Here you could integrate real email sending services like EmailJS or a backend.
});


// Function to send data to Google Sheets
function sendOrderToGoogleSheets(name, email, orders, total) {
    const url = 'https://script.google.com/macros/s/AKfycby1fz_TEHv7RzZioi0h-zxxfqZF6eVSBs7wEIdcIs5mthe86iFBmPvEo8DKEh33Y9YAFg/exec';  // Replace with your Google Web App URL
    
    // Create data object
    const data = {
        name: name,
        email: email,
        orders: orders,
        total: total
    };
    
    // Send the data via POST request
    fetch(url, {
        method: 'POST',
        mode: 'no-cors',  // 'no-cors' to avoid CORS issues
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        alert('Pesanan telah berhasil dikirim!');
    })
    .catch(error => {
        console.error('Error sending data:', error);
        alert('Ada kesalahan saat mengirimkan pesanan Anda.');
    });
}

// Order Button Event Listener
document.getElementById('order-btn').addEventListener('click', function() {
    // Get customer name and email
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;

    // Get total order price (remove commas for accurate sending)
    const totalPrice = document.getElementById('grandTotal').textContent.replace(/\./g, '');

    // Collect food order quantities with names
    const foodNames = ['Bakso', 'Mie Ayam', 'Kebab', 'Es Teh', 'Buavita'];
    let foodOrders = [];
    for (let i = 0; i < quantities.length; i++) {
        if (parseInt(quantities[i].textContent, 10) > 0) {
            foodOrders.push(`${quantities[i].textContent} x ${foodNames[i]}`);
        }
    }
    
    // Convert food orders array to a string
    let foodOrderString = foodOrders.join(", ");

    // Validate that the name and email are filled in
    if (customerName === "" || customerEmail === "") {
        alert("Isi terlebih dahulu nama dan nomor Hp.");
        return;
    }

    // Send data to Google Sheets
    sendOrderToGoogleSheets(customerName, customerEmail, foodOrderString, totalPrice);
});
