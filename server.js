
const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); 
const app = express();
const port = 3000;

// *******************************************************************
// ⚠️ 1. MONGODB CONNECTION SETUP ⚠️
const MONGODB_URI = 'mongodb+srv://paridhig0305_db_user:irVcsizPXLPmQoKf@cluster0.ytgexdy.mongodb.net/?appName=Cluster0'
// *******************************************************************

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB successfully connected!'))
    .catch(err => console.error('MongoDB connection error:', err));
// Body parser to read form data (required for login/signup)
app.use(express.urlencoded({ extended: true }));



// 2. MONGOOSE SCHEMA 
const ReviewSchema = new mongoose.Schema({
    reviewerName: { type: String, required: true },
    reviewText: { type: String, required: true },
    date: { type: Date, default: Date.now }
});
const Review = mongoose.model('Review', ReviewSchema);
// USER SCHEMA FOR SIGNUP / LOGIN
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", UserSchema);



// ----------------------------------------------------
// CRITICAL CONFIGURATION SECTION
// ----------------------------------------------------
app.set('view engine', 'ejs');
// Tell Express that EJS files are in /views
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname)));


// 3. ROUTES AND CRUD OPERATIONS

// R (Read): Display all existing reviews (Uses res.render for EJS)
app.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ date: -1 });
        res.render('reviews', { reviews: reviews });
    } catch (err) {
        res.status(500).send('Error fetching reviews: ' + err.message);
    }
});
// SIGN UP ROUTE - SAVES NEW USER
app.post("/signup", async (req, res) => {
    try {
        console.log(req.body);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        await user.save();
        res.send("Signup successful!");
    } catch (err) {
        res.send("Error: " + err.message);
    }
});


// C (Create): Handle submission of a new review
app.post('/reviews', async (req, res) => {
    try {
        const newReview = new Review({
            reviewerName: req.body.name,
            reviewText: req.body.review
        });

        await newReview.save();
        res.redirect('/reviews');
    } catch (err) {
        res.status(400).send('Error submitting review: ' + err.message);
    }
});


// ----------------------------------------------------
// ALL STATIC ROUTES (NOW USING path.resolve for absolute certainty)
// ----------------------------------------------------

// Home Page Route (Route: /) - Looks for 'home.html'
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'home.html'));
});

// Menu Page Route (Route: /menu) - Looks for 'menu.html'
app.get('/menu', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'menu.html'));
});

// Contact Us Page Route (Route: /contact) - Looks for 'contact.html'
app.get('/contact', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'contact.html'));
});

// About Us Page Route (Route: /about) - Looks for 'about.html'
app.get('/about', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'about.html'));
});

// Subscription Page Route (Route: /subscription) - Looks for 'subscription.html'
app.get('/subscription', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'subscription.html'));
});

// Sign In Page Route (Route: /signin) - Looks for 'signin.html'
app.get('/sign', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'sign.html'));
});
// SIGN IN ROUTE - CHECKS IF USER EXISTS
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.send("User not found!");
        }

        if (user.password !== password) {
            return res.send("Incorrect password!");
        }

        res.send("Login successful!");
    } catch (err) {
        res.send("Error: " + err.message);
    }
});



// START THE SERVER 
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log('MongoDB connection attempt initiated...');
    console.log('Access the Reviews CRUD page at: http://localhost:3000/reviews');
});