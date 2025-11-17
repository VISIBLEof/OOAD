// Simple script to promote a user to teacher
const http = require('http');

const data = JSON.stringify({
  email: 'yommongkol12@gmail.com'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/promote-teacher',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('Response Body:', responseData);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(data);
req.end();
