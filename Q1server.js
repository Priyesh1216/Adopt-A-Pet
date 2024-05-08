const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Define the functions
// A) Function: findSummation
const findSummation = (number = 1) => {
    if (typeof number !== 'number' || number <= 0) {
        return false;
    }
    let sum = 0;
    for (let i = 1; i <= number; i++) {
        sum += i;
    }
    return sum.toString(); // Converted to string to match previous response format
};

// B) Function: uppercaseFirstandLast
const uppercaseFirstandLast = (str) => {
    if (typeof str !== 'string') {
        return false;
    }
    return str.replace(/\b(\w)(\w*)(\w)\b/g, function(_, first, middle, last) {
        return first.toUpperCase() + middle + last.toUpperCase();
    });
};

// C) Function: findAverageAndMedian
const findAverageAndMedian = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) {
        return false;
    }
    const sum = arr.reduce((acc, val) => acc + val, 0);
    const avg = sum / arr.length;

    const sortedArr = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(sortedArr.length / 2);
    const median = sortedArr.length % 2 !== 0 ? sortedArr[mid] : (sortedArr[mid - 1] + sortedArr[mid]) / 2;

    return { average: avg, median: median };
};

// D) Function: find4Digits
const find4Digits = (numbersStr) => {
    const numbers = numbersStr.split(' ').map(Number);
    const fourDigitNumber = numbers.find(num => num >= 1000 && num <= 9999);
    return fourDigitNumber !== undefined ? fourDigitNumber.toString() : 'false';
};

// Define routes

// A) Route for findSummation
app.get('/findSummation', (req, res) => {
    const number = parseInt(req.query.number);
    const result = findSummation(number);
    res.send(result);
});

// B) Route for uppercaseFirstandLast
app.get('/uppercaseFirstandLast', (req, res) => {
    const str = req.query.str;
    const result = uppercaseFirstandLast(str);
    res.send(result);
});

// C) Route for findAverageAndMedian
app.get('/findAverageAndMedian', (req, res) => {
    const numbers = req.query.numbers.split(' ').map(Number);
    const result = findAverageAndMedian(numbers);
    res.json(result);
});

// D) Route for find4Digits
app.get('/find4Digits', (req, res) => {
    const numbersStr = req.query.numbersStr;
    const result = find4Digits(numbersStr);
    res.send(result); // Corrected response to send the result directly
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});