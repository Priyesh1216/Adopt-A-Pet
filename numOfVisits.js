const express = require('express');
const cookieParser = require('cookie-parser');
const moment = require('moment-timezone');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse cookies
app.use(cookieParser());

// Route handler for the root URL
app.get('/', (req, res) => {
    res.redirect('/numOfVisits');
});

// Route handler for the numOfVisits page
app.get('/numOfVisits', (req, res) => {
    let numOfVisits = parseInt(req.cookies.numOfVisits) || 0;
    let visitMessage;

    if (numOfVisits === 0) {
        visitMessage = 'Welcome to my webpage! It is your first time that you are here.';
    } else {
        visitMessage = `Hello, this is the ${numOfVisits} time that you are visiting my webpage.`;
        const lastVisitTime = req.cookies.lastVisitTime;
        if (lastVisitTime) {
            const formattedTime = moment(lastVisitTime).tz('America/New_York').format('ddd MMM DD HH:mm:ss z YYYY');
            visitMessage += ` Last time you visited my webpage on: ${formattedTime}`;
        }
    }

    // Increase the number of visits and update the last visit time
    numOfVisits++;
    res.cookie('numOfVisits', numOfVisits);
    res.cookie('lastVisitTime', new Date());

    // Send the response
    res.send(`<h1>${visitMessage}</h1>`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
