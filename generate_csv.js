const mysql = require("mysql");
const fs = require("fs");

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

  // Query the database to retrieve data
  const selectQuery = 'SELECT companyName, address, description FROM companies';

  connection.query(selectQuery, (err, rows) => {
    if (err) {
      console.error('Error querying the database:', err);
      connection.end();
      return;
    }

    // Format the data as CSV
    const csvData = rows.map(row => Object.values(row).join(','));

    // Save the data to a CSV file
    const filename = 'companies.csv';
    fs.writeFile(filename, csvData.join('\n'), 'utf8', (error) => {
      if (error) {
        console.error('Error exporting data:', error);
      } else {
        console.log(`Data exported to ${filename}`);
      }
      connection.end();
    });
  });
});
