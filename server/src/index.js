require('dotenv').config()
const cors = require('cors');
const express = require("express")
const app = express()
const path = require("path")
const bcrypt = require("bcryptjs")
const cookieParser = require('cookie-parser')
const hbs = require("hbs")
const nodemailer = require('nodemailer');

require("../src/db/conection.js");
const User = require("../src/models/users")
const Organization = require("../src/models/org")


const port = process.env.PORT || 4000


app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(cors({
  origin: "*"
}))

const public_path = path.join(__dirname, "../public")
const temp_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")

app.use(cookieParser())
app.use(express.static(public_path))
app.set("view engine", "hbs")
app.set("views", temp_path)
hbs.registerPartials(partials_path)



/********* User **********/
// User registeration
app.post("/users", async (req, res) => {
  try {
    const { name, email, password, conPassword } = req.body;

    // Validate if passwords match
    if (password !== conPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create a new user
    const newUser = new User({ name, email, password });

    // Save the user to the database
    await newUser.save();

    const userData = newUser.toObject();

    res.status(201).json({ message: 'Registration successful', user: userData });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// get users
app.get('/users', async (req, res) => {
  try {
    const getUser = await User.find({});
    res.send(getUser);
  } catch (e) {
    res.status(400).send(e);
  }
})


// user login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Passwords match, send user data (excluding password)
      res.status(200).json({ message: 'Login successful', userID: user._id });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// find user by id 
app.get('/user/:Id', async (req, res) => {
  const userId = req.params.Id;

  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'user not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// find user by email 
app.get('/useremail/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.json({ userData: user });
    } else {
      res.status(404).json({ error: 'user not found' });
    }
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error ${error}` });
  }
});



/********* orgnization **********/
// org registeration
app.post('/registerOrg', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if email already exists
    const existingOrganization = await Organization.findOne({ email });
    if (existingOrganization) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Generate a unique 6-digit code
    const uniqueCode = await generateUniqueCode();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new organization
    const newOrganization = new Organization({ name, email, password: hashedPassword, code: uniqueCode });

    // Save the organization to the database
    await newOrganization.save();

    res.status(201).json({ message: 'Registration successful', organization: newOrganization });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to generate a unique 6-digit code
async function generateUniqueCode() {
  const code = Math.floor(100000 + Math.random() * 900000);

  // Check if the code already exists in the database
  const existingOrganization = await Organization.findOne({ code });
  if (existingOrganization) {
    return generateUniqueCode(); // Recursively generate a new code if it already exists
  }

  return code;
}


//  login organization 
app.post('/loginOrg', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the organization by email
    const organization = await Organization.findOne({ email });

    // Check if the organization exists
    if (!organization) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, organization.password);

    if (passwordMatch) {
      // Passwords match, send organization data (excluding password)
      const organizationData = { email: organization.email, id: organization._id };
      res.status(200).json({ message: 'Login successful', organization: organizationData });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





// get organization
app.get('/orgs', async (req, res) => {
  try {
    const getOrg = await Organization.find({});
    res.send(getOrg);
  } catch (e) {
    res.status(400).send(e);
  }
})

// get single organization 
app.get('/orgs/:orgId', async (req, res) => {
  const orgId = req.params.orgId;

  try {
    const orgnization = await Organization.findOne({ _id: orgId });
    if (orgnization) {
      res.json(orgnization);
    } else {
      res.status(404).json({ error: 'orgnization not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});







// authentication for read document 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ncddocverify@gmail.com',
    pass: 'xxkw ndrt kfrj xxiy',
  },
});

const generatedOTPs = {};

app.post('/generate-otp', (req, res) => {
  const { userEmail } = req.body;
  console.log(userEmail)

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store the generated OTP in memory
  generatedOTPs[userEmail] = otp;

  // Email content
  const mailOptions = {
    from: 'ncddocverify@gmail.com',
    to: userEmail,
    subject: 'OTP for Document Access',
    text: `Your OTP is: ${otp}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.json({ success: false, error: 'Error sending email' });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ success: true, message: 'Email sent successfully' });
    }
  });
});

app.post('/validate-otp', (req, res) => {
  const { userEmail, enteredOTP } = req.body;

  // Check if the entered OTP matches the generated OTP
  if (generatedOTPs[userEmail] && generatedOTPs[userEmail] === enteredOTP) {
    // Clear the stored OTP after successful validation
    delete generatedOTPs[userEmail];
    res.json({ success: true, message: 'OTP validation successful' });
  } else {
    res.json({ success: false, error: 'Invalid OTP' });
  }
});




app.listen(port, (e) => {
  console.log(`server is running on port ${port}`)
})