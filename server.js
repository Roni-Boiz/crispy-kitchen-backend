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
    host: process.env.DB_HOST, // Your database host
    port: process.env.DB_PORT, // Your database port (3306 for MySQL)
    user: process.env.DB_USER, // Your database username
    password: process.env.DB_PASSWORD, // Your database password
    database: process.env.DB_NAME // Change to your database name
});

// Connect to the database
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL Database.');
});

// Endpoint for subscription form
app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    
    const sql = 'INSERT INTO subscribers (email) VALUES (?)';
    db.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error subscribing' });
        }
        res.status(200).json({ message: 'Subscribed successfully!' });
    });
});

// Endpoint for booking form
app.post('/api/book', (req, res) => {
    const { name, email, phone, people, date, time, message } = req.body;

    if (!name || !email || !phone || !people || !date || !time || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const sql = 'INSERT INTO bookings (name, email, phone, people, date, time, message) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, email, phone, people, date, time, message], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error making booking' });
        }
        res.status(200).json({ message: 'Booking made successfully!' });
    });
});

// Endpoint for contact form
app.post('/api/contact', (req, res) => {
    const { contact_name, contact_phone, contact_email, contact_message } = req.body;

    if (!contact_name || !contact_phone || !contact_email || !contact_message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const sql = 'INSERT INTO comments (name, phone, email, comment) VALUES (?, ?, ?, ?)';
    db.query(sql, [contact_name, contact_phone, contact_email, contact_message], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error sending message' });
        }
        res.status(200).json({ message: 'Message sent successfully!' });
    });
});

// Endpoint for comment form
app.post('/api/comment', (req, res) => {
    const { comment_name, comment_email, comment } = req.body;

    if (!comment_name || !comment_email || !comment) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = 'INSERT INTO comments (name, email, comment) VALUES (?, ?, ?)';
    db.query(query, [comment_name, comment_email, comment], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error: ' + err.message });
        }
        res.status(201).json({ message: 'Comment submitted successfully!' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

