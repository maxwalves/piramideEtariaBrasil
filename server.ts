const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

// Enable CORS for cross-origin requests
app.use(cors());
const port = 3333;

// Define route for fetching census data
app.get('/censo', async (req, res) => {
  try {
    // Retrieve all census data from the database
    const allCensus = await prisma.censo.findMany({
      select: {
        year: true,
        url: true
      }
    });
    // Send retrieved census data as JSON response
    res.json(allCensus);
  } catch (error) {
    // Log and send error response if there's an issue retrieving data
    console.error('Error retrieving censuses:', error);
    res.status(500).json({ error: 'Error retrieving censuses' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
