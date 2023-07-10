const express = require('express');
const mysql = require('mysql');

const app = express();

// MySQL configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test',
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL server');
});

// Define a route to fetch and display the data
app.get('/', (req, res) => {
  // Retrieve data from the table
  const selectQuery = 'SELECT * FROM companies';

  connection.query(selectQuery, (err, rows) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).send('Error retrieving data from database');
    }

    // Generate the HTML table dynamically with added styles
    let html = `
      <style>
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          text-align: left;
          padding: 8px;
        }
        th {
          background-color: #f2f2f2;
          color: #333333;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
      </style>
      <table>
        <tr>
          <th>ID</th>
          <th>Company Name</th>
          <th>Address</th>
          <th>Description</th>
        </tr>
    `;

    rows.forEach((row) => {
      html += `
        <tr>
          <td>${row.id}</td>
          <td>${row.companyName}</td>
          <td>${row.address}</td>
          <td>${row.description}</td>
        </tr>
      `;
    });

    html += '</table>';

    // Send the HTML response
    res.send(html);
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
