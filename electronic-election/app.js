// const express = require('express');
// const app = express();
// const apiRoutes = require('./routes/api');
// require('dotenv').config();

// app.use(express.json());
// app.use('/api', apiRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const express = require('express');
const app = express();
const port = 5000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Use the API routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Election API');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
