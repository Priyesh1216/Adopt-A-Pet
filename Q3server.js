const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.post('/validatePhoneNumber', (req, res) => {
    console.log('Raw request body:', req.body); // Add this line for debugging
    const phoneNumber = req.body.phoneNumber;
    console.log('Received phone number:', phoneNumber);
    const isValidPhoneNumber = /^\d{3}-\d{3}-\d{4}$/.test(phoneNumber);
    const response = isValidPhoneNumber ? 'The phone number is correct.' : 'Invalid phone number format. Please use the format ddd-ddd-dddd.';
    res.send(response);
});

// Serve the HTML document
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/telephoneForm.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
