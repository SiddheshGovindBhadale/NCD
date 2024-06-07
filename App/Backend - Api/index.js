const ethers = require('ethers');
const cors = require('cors');
const express = require('express');
require('dotenv').config();

require('./db/conection');
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const Organization = require('./models/org')

const app = express();

const port = process.env.PORT || 8000

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))

app.use(cors({
    origin: "*"
}))


const initializeContract = () => {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const { abi } = require('./contract/doc.json');
    return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
};

const contractInstance = initializeContract();

app.get('/documents', async (req, res) => {
    try {
        const product = await contractInstance.getDocs();
        res.json({ data: product });
    } catch (error) {
        console.error('Error fetching contract data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

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

app.listen(port, () => {
    console.log(`API server is listening on port ${port}`);
});
