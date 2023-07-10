/*const axios=require("axios");
const cheerio=require("cheerio");
const fetchTitles=async() => {
try {
const response=await
axios.get('https://www.businesslist.co.ke/category/schools-kenya');
const html = response.data;
const $ = cheerio.load(html);
const title_names = [];
$('div > .company >h4 >a').each((_idx, el) => {
const title_name = $(el).text()
title_names.push(title_name)
});


//access  a  attributes
$('div > a').each((_idx, el) => {
    const href = $(el).attr('href');
    title_names.push(href);
  });
  
return title_names;
} catch (error) {
throw error;
}};
fetchTitles().then((title_names) => console.log(title_names));*/

/*const axios = require("axios");
const cheerio = require("cheerio");

const fetchTitles = async () => {
  try {
    const response = await axios.get('https://www.businesslist.co.ke/category/schools-kenya');
    const html = response.data;
    const $ = cheerio.load(html);
    const title_names = [];
    const addresses = []; // New array to store addresses

    $('div > .company > h4 > a').each((_idx, el) => {
      const title_name = $(el).text();
      title_names.push(title_name);
    });

    // Access 'a' attributes
    $('div > .address').each((_idx, el) => {
        const address = $(el).text()
        addresses.push(address)
        });
        

    

    // Fetch addresses from a separate div
    $('.address').each((_idx, el) => {
      const address = $(el).text().trim();
      addresses.push(address);
    });

    // Return an object containing both title names and addresses
    return { title_names, addresses };
  } catch (error) {
    throw error;
  }
};

fetchTitles().then(({ title_names, addresses }) => {
  console.log("Title Names:", title_names);
  console.log("Addresses:", addresses);
});*/

/*
const axios = require("axios");
const cheerio = require("cheerio");

const fetchTitles = async () => {
  try {
    const response = await axios.get('https://www.businesslist.co.ke/category/schools-kenya');
    const html = response.data;
    const $ = cheerio.load(html);
    const results = [];

    $('.company').each((_idx, el) => {
      const companyName = $(el).find('h4 > a').text().trim();
      const address = $(el).find('.address').text().trim();
      const description = $(el).find('.desc').text().trim();
      results.push({ companyName, address, description });
    });

    return results;
  } catch (error) {
    throw error;
  }
};

fetchTitles().then((results) => {
  console.log(results);
});*/



const axios = require("axios");
const cheerio = require("cheerio");
const mysql = require("mysql");

const fetchTitles = async () => {
  try {
    const response = await axios.get('https://www.businesslist.co.ke/category/schools-kenya');
    const html = response.data;
    const $ = cheerio.load(html);
    const results = [];

    $('.company').each((_idx, el) => {
      const companyName = $(el).find('h4 > a').text().trim();
      const address = $(el).find('.address').text().trim();
      const description = $(el).find('.desc').text().trim();
      results.push({ companyName, address, description});
    });

    return results;
  } catch (error) {
    throw error;
  }
};

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

  // Create a table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE  companies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      companyName VARCHAR(255),
      address VARCHAR(255),
      description TEXT
    )
  `;

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err);
      connection.end();
      return;
    }
    console.log('Table created or already exists');

    // Fetch data and insert into the table
    fetchTitles()
      .then((results) => {
        const insertQuery = 'INSERT INTO companies (companyName, address, description) VALUES ?';
        const values = results.map((result) => [result.companyName, result.address, result.description]);

        connection.query(insertQuery, [values], (err, result) => {
          if (err) {
            console.error('Error inserting data:', err);
          } else {
            console.log(`${result.affectedRows} row(s) inserted`);
          }
          connection.end();
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        connection.end();
      });
  });
});



