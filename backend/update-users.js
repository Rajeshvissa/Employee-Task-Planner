const db = require('./config/db');

// Update user names to match employees
db.query("UPDATE users SET name = 'Vissa Chenchu Rajesh' WHERE id = 2", (err) => {
  if (err) console.error('Error updating user 2:', err);
  else console.log('User 2 (rr) updated to Vissa Chenchu Rajesh');
});

db.query("UPDATE users SET name = 'John Doe' WHERE id = 3", (err) => {
  if (err) console.error('Error updating user 3:', err);
  else console.log('User 3 updated to John Doe');
});

db.query("SELECT id, name, role FROM users", (err, users) => {
  if (err) console.error('Error fetching users:', err);
  else {
    console.log('\n=== UPDATED USERS ===');
    console.table(users);
  }
  process.exit(0);
});
