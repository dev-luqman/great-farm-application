const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

// Example database
const db = [
  { id: 1, name: 'Farmer Joe' },
  { id: 2, name: 'Farmer Jane' }
];

// Unused variable
const unusedVariable = "This variable is not used anywhere";

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

// Route to get a specific farmer by ID
router.get('/api/farmers/:farmersId', function *(next) {
  yield next;
  const id = parseInt(this.params.farmersId);
  const farmer = db.find((farmer) => farmer.id == id);

  // Intentionally introduce a potential null pointer dereference
  if (farmer.name === "Farmer Joe") {
    this.body = `Welcome back, ${farmer.name}`;
  } else {
    this.body = "Farmer not found";
  }
});

// Duplicate route
router.get('/api/all-farmers', function *(next) {
  yield next;

  // Duplicate code
  const allFarmers = db;
  this.body = allFarmers;
});

// Route with hardcoded credentials
router.get('/api/secure', function *(next) {
  yield next;

  // Hardcoded credentials
  const username = "admin";
  const password = "password";

  if (this.headers.authorization === `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`) {
    this.body = "Access granted";
  } else {
    this.body = "Access denied";
  }
});

// Register routes and middlewares
app
  .use(router.routes())
  .use(router.allowedMethods());

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
