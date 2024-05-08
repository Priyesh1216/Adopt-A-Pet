// serverFunctions.js

// Define a function to update the clock
function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    // Add leading zeros to single digit minutes and seconds
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    var timeString = hours + ':' + minutes + ':' + seconds;

    // Return the time string
    return timeString;
}

// Define a function to get the current date
function getCurrentDate() {
    // Create a set option format
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };

    // Create the Date object
    const currentDate = new Date();

    // Get and return the current date
    var date = currentDate.toLocaleDateString('en-US', options);
    return date;
}

// Define a function to validate email format
function validateEmail(email) {
    // Regular expression pattern for email validation
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

 // Define a function to handle form submission
 function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    var form = event.target;

    // Check the ID of the form
    if (form.id === 'answersAway') {
        // Handle form 1 submission

        // Get form elements
        var form = document.getElementById('answersAway');
        var type = form.querySelector('input[name="type"]:checked');
        var age = form.querySelector('select[name="age"]');
        var gender = form.querySelector('input[name="gender"]:checked');
        var breed = form.querySelector('input[name="breed"]');
        var otherAnimals = form.querySelectorAll('input[name="type[]"]:checked');
        var familyWithChildren = form.querySelectorAll('input[name="type[]"]:checked');
        var comments = form.querySelector('textarea#title');
        var givenName = form.querySelector('input[name="givenName"]');
        var familyName = form.querySelector('input[name="familyName"]');
        var email = form.querySelector('input[name="email"]');

        // Check if any field is empty
        if (!type || !age || !gender || !otherAnimals.length || !familyWithChildren.length || !comments.value || !givenName.value || !familyName.value || !email.value) {
            alert('Please fill in all fields.');
            return;
        }

        // Validate email format
        if (!validateEmail(email.value)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Store user answers
        var userAnswers = {
            type: type.value,
            age: age.value,
            gender: gender.value,
            breed: breed.value,
            otherAnimals: Array.from(otherAnimals).map(input => input.value),
            familyWithChildren: Array.from(familyWithChildren).map(input => input.value),
            comments: comments.value,
            givenName: givenName.value,
            familyName: familyName.value,
            email: email.value
        };

        // Do something with the user answers (e.g., send them to a server)

        // Optionally, reset the form
        form.reset();

        // Optionally, display a success message
        alert('Form submitted successfully!');
        
    } 
    

    else if (form.id === 'answersFind') {
        // Handle form 2 submission

        // Get form elements
        // Get form elements
        var form = document.getElementById('answersFind');
        var type = form.querySelector('input[name="type"]:checked');
        var age = form.querySelector('select[name="age"]');
        var breed = form.querySelector('select[name="age"]');
        var gender = form.querySelector('input[name="gender"]:checked');
        var otherAnimals = form.querySelectorAll('input[name="type[]"]:checked');

        // Check if any field is empty
        if (!type || !age || !breed || !gender || !otherAnimals.length) {
            alert('Please fill in all fields.');
            return; // Prevent form submission
            }


        // Do something with the user answers (e.g., send them to a server)

        // Optionally, reset the form
        form.reset();

        // Optionally, display a success message
        alert('Form submitted successfully!');
            
        }

}

// Export the functions
module.exports = { updateClock, getCurrentDate, validateEmail };