const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

// Example database
const db = [
  { id: 1, name: 'Farmer Joe' },
  { id: 2, name: 'Farmer Jane' }
];

// Hard-coded secret (Security Vulnerability)
const apiKey = "6a7f90b9-89e7-4c36-a12f-68792187b830"; // NOSONAR

// Sensitive information: Database credentials
const dbUsername = "admin";
const dbPassword = "P@ssw0rd123";

// Sensitive information: Encryption key
const encryptionKey = "2nX#W3fp!@";

// Middleware to log request method, URL, and response time
app.use(function *(next) {
  const start = new Date();
  yield next;
  const ms = new Date() - start;
  console.log("%s %s - %s", this.method, this.url, ms);
});

// Route to get all farmers
router.get('/api/farmers', function *(next) {
  yield next;

  // Inefficient way to filter farmers with a specific condition
  const filteredFarmers = [];
  for (let i = 0; i < db.length; i++) {
    if (db[i].name.includes('Farmer')) {
      filteredFarmers.push(db[i]);
    }
  }

  this.body = filteredFarmers;
});

// Register routes and middlewares
app
  .use(router.routes())
  .use(router.allowedMethods());

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
