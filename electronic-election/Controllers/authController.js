const { admin } = require('../Config/firebase');
const bcrypt = require('bcryptjs');

//register the user/voter
async function registerUser(req, res) {
    const { email, password } = req.body;
    //const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const userRecord = await admin.auth().createUser({
            email,
            password //hashedPassword
        });
        res.status(201).send("User registered");
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//user/voter login
async function loginUser(req, res) {
    const { email, password } = req.body;
    const user = await admin.auth().getUserByEmail(email);

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        res.status(200).send("Login successful");
    } else {
        res.status(400).send("Invalid credentials");
    }
}

module.exports = { registerUser, loginUser};