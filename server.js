const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost', // Your database host
    port: process.env.DB_PORT || '3306', // Your database port (3306 for MySQL)
    user: process.env.DB_USER || 'root', // Your database username
    password: process.env.DB_PASSWORD || '', // Your database password
    database: process.env.DB_NAME // Change to your database name
});

// Connect to the database
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL Database.');
});

// Health check endpoint to verify backend status
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Backend is running properly!' });
});

// Endpoint for subscription form
app.post('/subscribe', (req, res) => {
    const { subscribe_email } = req.body;

    if (!subscribe_email) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    
    const sql = 'INSERT INTO subscribers (email) VALUES (?)';
    db.query(sql, [subscribe_email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error subscribing' });
        }
        res.status(200).json({ message: 'Subscribed successfully!' });
    });
});

// Endpoint for booking form
app.post('/book', (req, res) => {
    const { name, email, phone, people, date, time, message } = req.body;

    if (!name || !email || !phone || !people || !date || !time || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const sql = 'INSERT INTO bookings (name, email, phone, number_of_persons, booking_date, booking_time, special_request) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, email, phone, people, date, time, message], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error making booking' });
        }
        res.status(200).json({ message: 'Booking made successfully!' });
    });
});

// Endpoint for contact form
app.post('/contact', (req, res) => {
    const { contact_name, contact_phone, contact_email, contact_message } = req.body;

    if (!contact_name || !contact_phone || !contact_email || !contact_message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const sql = 'INSERT INTO contactus (name, phone, email, message) VALUES (?, ?, ?, ?)';
    db.query(sql, [contact_name, contact_phone, contact_email, contact_message], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error sending message' });
        }
        res.status(200).json({ message: 'Message sent successfully!' });
    });
});

// Endpoint for comment form
app.post('/comment', (req, res) => {
    const { comment_name, comment_email, comment } = req.body;

    if (!comment_name || !comment_email || !comment) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = 'INSERT INTO comments (name, email, comment) VALUES (?, ?, ?)';
    db.query(query, [comment_name, comment_email, comment], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error: ' + err.message });
        }
        res.status(200).json({ message: 'Comment submitted successfully!' });
    });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

