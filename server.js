require('dotenv').config();
const express = require('express');
const connectDB = require('./db/db');

const app = express();

//Connection to DB :
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));
// Define Routes :
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));

//* For Admins:
app.use('/api/admin/auth', require('./routes/api/admin/authAdmin'));
app.use('/api/admin/profile', require('./routes/api/admin/adminProfile'));
app.use('/api/admin/admins', require('./routes/api/admin/admins'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
