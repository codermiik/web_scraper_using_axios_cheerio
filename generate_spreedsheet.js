const mysql = require("mysql");
const ExcelJS = require("exceljs");

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

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Companies');

    // Define column headers
    worksheet.columns = [
      { header: 'Company Name', key: 'companyName', width: 30 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'Description', key: 'description', width: 50 },
    ];

    // Populate data from the database
    rows.forEach((row) => {
      worksheet.addRow(row);
    });

    // Save the workbook to a file
    const filename = 'companies.xlsx';
    workbook.xlsx.writeFile(filename)
      .then(() => {
        console.log(`Data exported to ${filename}`);
        connection.end();
      })
      .catch((error) => {
        console.error('Error exporting data:', error);
        connection.end();
      });
  });
});
