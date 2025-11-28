const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rajeshvissa@mysql11',
  database: 'employee_tracker'
});

connection.connect();

console.log('=== CHECKING DATABASE ===\n');

// Check users
console.log('--- USERS ---');
connection.query('SELECT id, name, role FROM users;', (err, results) => {
  if (err) console.error('Error fetching users:', err);
  else console.table(results);
});

// Check tasks
console.log('\n--- TASKS ---');
connection.query('SELECT id, title, assigned_to, status FROM tasks;', (err, results) => {
  if (err) console.error('Error fetching tasks:', err);
  else console.table(results);
});

// Check employees
console.log('\n--- EMPLOYEES ---');
connection.query('SELECT id, name, email FROM employees;', (err, results) => {
  if (err) console.error('Error fetching employees:', err);
  else console.table(results);

  connection.end();
});
