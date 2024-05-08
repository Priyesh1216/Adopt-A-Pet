// Import required modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

// Require server-side JavaScript functions
const {validateEmail} = require('./serverFunctions');

// Create an Express.js application
const app = express();

// Set the 'views' directory for HTML templates
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the current directory
app.use(express.static('views'));

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));


// Routes
app.get('/away', (req, res) => {
    const username = req.session.username;
    if (!username) {
        // If user is not logged in, redirect to login page
        return res.redirect('/login');
    }
    res.render('away', { username: username });
});


app.post('/submitForm', (req, res) => {
    const {
        type,
        age,
        gender,
        getsAlong,
        breed,
        givenName,
        familyName,
        email,
        comments
    } = req.body;

     // Validate form fields
     if (!type || !age || !breed || !gender || !getsAlong || !givenName || !familyName || !email) {
        return res.send('<script>alert("Please fill in all fields."); window.history.back();</script>');
    }

     // Validate email format
     if (!validateEmail(email)) {
        return res.send('<script>alert("Please enter a valid email address."); window.history.back();</script>');
    }
    
    //console.log ('Along', getsAlong);
    // Get the username from the session
    const username = req.session.username;

    // Construct the pet record
    const petRecord = `${username}:${type}:${age}:${gender}:${getsAlong}:${breed}:${comments}`;


    // Read the file containing available pet information
    fs.readFile('pet_info.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.send('<script>alert("Error reading pet info file"); window.history.back();</script>');
        }

        // Parse the file content
        const lines = data.trim().split('\n');
        const petCount = lines.length;

        // Construct the new entry
        const newEntry = `${petCount + 1}:${petRecord}`;

        // Append the new entry to the file
        fs.appendFile('pet_info.txt', newEntry + '\n', (err) => {
            if (err) {
                console.error(err);
                return res.send('<script>alert("Error adding pet info"); window.history.back();</script>');
            }
            // Redirect to a success page or render a success message
            return res.send('<script>alert("Successfully submitted"); window.history.back();</script>');
        });
    });
});

// Other routes...

app.get('/home', (req, res) => {
    const username = req.session.username;
    res.render('home', { username: username });
});

app.get('/header', (req, res) => {
    const username = req.session.username;
    res.render('header', {username: username});
});

app.get('/', (req, res) => {
    const username = req.session.username;
    res.render('home', { username: username });
});

app.get('/create', (req, res) => {
    const success = req.session.success;
    const username = req.session.username;
    res.render('create', {message: success, username: username });
});

app.get('/login', (req, res) => {
    const username = req.session.username;
    res.render('login', {username: username});
});

// Render the initial form
app.get('/find', (req, res) => {
    res.render('find');
});


app.get('/contactUs', (req, res) => {
    const username = req.session.username;
    res.render('contactUs', { username: username });
});

app.get('/catcare', (req, res) => {
    const username = req.session.username;
    res.render('catcare', { username: username });
});


app.get('/dogcare', (req, res) => {
    const username = req.session.username;
    res.render('dogcare', { username: username });
});



app.get('/matchedPets', (req, res) => {
    //ITS NOT GETTING HERE
    const matchingPets = req.session.matchingPets;
    console.log('Matching Pets:', matchingPets); // Log matchingPets to the console

    // Render the matchedPets.ejs file and pass the matching pets data
    res.render('matchedPets', {matchingPets: matchingPets});
});


app.post('/create', (req, res) => {
    const { username, password } = req.body;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
        return res.send('<script>alert("Invalid username format. Username can only contain letters and digits."); window.history.back();</script>');
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
    if (!passwordRegex.test(password)) {
        return res.send('<script>alert("Invalid password format. Password must be at least 4 characters long, with at least one letter and one digit."); window.history.back();</script>');
    }
    fs.readFile('logins.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.send('<script>alert("Error reading login file"); window.history.back();</script>');
        }
        const existingUsernames = data.split('\n').map(line => line.split(':')[0]);
        if (existingUsernames.includes(username)) {
            return res.send('<script>alert("Username already exists. Please choose a different one."); window.history.back();</script>');
        }
        const loginInfo = `${username}:${password}\n`;
        fs.appendFile('logins.txt', loginInfo, err => {
            if (err) {
                console.error(err);
                return res.send('<script>alert("Error writing to login file"); window.history.back();</script>');
            }
            req.session.username = username;
            const success = "Account successfully created! You can now login whenever you are ready.";
            req.session.success = success; // Store success message in session
            return res.redirect('/create');
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    fs.readFile('logins.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.send('<script>alert("Error reading login file"); window.history.back();</script>');
        }
        const users = data.trim().split('\n').map(line => line.split(':'));
        const user = users.find(u => u[0] === username && u[1] === password);
        if (user) {
            req.session.username = username;
            return res.redirect('/');
        } else {
            return res.send('<script>alert("Invalid username or password."); window.history.back();</script>');
        }
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.send('<script>alert("Error logging out"); window.location.href = "/";</script>');
        }
        return res.redirect('/');
    });
});


// Handle form submission
app.post('/find', (req, res) => {
    const {
        type,
        age,
        gender,
        getsAlong2,
        breed
    } = req.body;

     // Validate form fields
     if (!type || !age || !breed || !gender || !getsAlong2) {
        return res.send('<script>alert("Please fill in all fields."); window.history.back();</script>');
    }

       // Read pet_info.txt file and filter matching pets
       fs.readFile('pet_info.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        const pets = data.split('\n');
        const matchingPets = pets.filter(pet => {
            const petFields = pet.split(':');
            if (petFields.length < 7) {
                return false; // Skip this line if it doesn't have enough fields
            }
            const [number, username, petType, petAge, petGender, petAlong, petBreed, comments] = petFields;
            console.log (getsAlong2);
            console.log(petAlong)
            // Split the petAlong string into an array if it's not undefined
            const petAlongArray = petAlong ? petAlong.split(',') : [];
            // Check if all elements of petAlong2 exist in petAlongArray
            const allMatch = getsAlong2.every(value => petAlongArray.includes(value.trim()));
            return (
                (type === 'Does not matter' || type === petType) &&
                (age === 'Does not matter' || age === petAge) &&
                (breed === 'Does not matter' || breed === petBreed) &&
                (gender === 'Does not matter' || gender === petGender) &&
                allMatch
            );
        });

        // Store matching pets data in the session
        req.session.matchingPets = matchingPets;

        // Redirect to the '/matchedPets' route to display the matching pets
        res.redirect('/matchedPets');
    });
});



// Start the server
//const PORT = 5143; // Port number specified in the URL
//app.listen(PORT, () => {
  //  console.log(`Server is running on http://soen287.encs.concordia.ca:${PORT}`);
//});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
