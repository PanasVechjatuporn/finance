require('dotenv').config({ path: '../.env' });
const firebaseAdmin = require('../configs/firebaseConfig');
const mongoController = require('../controllers/mongoController')

exports.signup = async (req, res) => {
  console.log(req.body)
  const { email, password, displayName } = req.body;
  firebaseAdmin.auth()
    .createUser({
      email: email,
      password: password,
      displayName: displayName
    })
    .then((userRecord) => {
      mongoController.create_new_user(userRecord)
      res.status(200).json({ userRecord });
    })
    .catch((error) => {
      console.log('Error creating new user:', error);
      res.status(500).json({ error: 'Error creating new user' });
    });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const signInResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });
    if (!signInResponse.ok) {
      const errorData = await signInResponse.json();
      throw new Error(errorData.error.message);
    }
    const signInData = await signInResponse.json();
    res.status(200).json({ signInData });
  } catch (error) {
    console.error('Error signing in user:', error.message);
    res.status(401).json({ message: 'Authentication failed' });
  }
};