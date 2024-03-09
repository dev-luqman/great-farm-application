const app = require("koa")();
const router = require("koa-router")();
const db = require("./db.json");

// Log requests
app.use(function* (next) {
  const start = new Date();
  yield next;
  const ms = new Date() - start;
  console.log("%s %s - %s", this.method, this.url, ms);
});

router.get('/api/product', function *(next) {
    this.body = db;
  });
  
  router.get('/api/product/:productId', function *(next) {
    const id = parseInt(this.params.playlistId);
    this.body = db.find((product) => product.id == id);
  });

router.get("/api/", function* () {
  this.body = "Products API ready to receive requests...";
});

router.get("/", function* () {
  this.body = "Setup and ready to receive request...";
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);

console.log("Worker started");
