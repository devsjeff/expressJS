import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

// ─── Quick Review Markdown ─────────────────────────────────────────────────────
const quickReviewMD = `# 🚂 Express.js — Quick Review Notes
> Cover all topics. Read in ~10 min.

---

## 🟢 BASICS (Topics 1–6)

### 1. What is Express.js
- Express is a **minimal Node.js web framework** for building servers and APIs.
- Node.js handles the runtime, Express gives you **routing + middleware** on top.
- Install: \`npm init -y\` then \`npm install express\`

### 2. Creating a Server
- \`const app = express()\` → creates the app.
- \`app.listen(3000, () => {})\` → starts the server on port 3000.
- Every request goes through middleware + a matching route handler.

### 3. Routing
- \`app.get('/path', handler)\` → respond to GET requests.
- \`app.post / .put / .delete / .patch\` → other HTTP methods.
- Handler receives \`(req, res)\` — req = request info, res = send a response.

### 4. Request Object (req)
- \`req.params\` → URL params like \`/users/:id\` → \`req.params.id\`
- \`req.query\` → query string like \`?name=dev\` → \`req.query.name\`
- \`req.body\` → request body (needs middleware: \`express.json()\`)

### 5. Response Object (res)
- \`res.send('text')\` → send text.
- \`res.json({ key: value })\` → send JSON.
- \`res.status(404).json({ error: 'Not found' })\` → send with status code.

### 6. Middleware
- Functions that run **between the request and the route handler**.
- Signature: \`(req, res, next) => {}\` — must call \`next()\` to continue.
- \`app.use()\` → registers middleware globally or per path.

---

## 🟡 INTERMEDIATE (Topics 7–12)

### 7. express.json() & express.urlencoded()
- Built-in middleware. Parses JSON body → available as \`req.body\`.
- Must be registered before any route that reads \`req.body\`.

### 8. Express Router
- \`express.Router()\` → creates a mini-app for organizing routes.
- Define routes on the router, mount with \`app.use('/prefix', router)\`.
- Keeps code modular — one file per resource (users, posts, products).

### 9. Error Handling Middleware
- 4-argument middleware: \`(err, req, res, next)\` — Express detects this automatically.
- Place at the end of all middleware/routes.
- Call \`next(err)\` from any route to jump to error handler.

### 10. Static Files
- \`app.use(express.static('public'))\` → serve files from the public folder.
- Files like images, CSS, HTML served automatically without a route.

### 11. Environment Variables
- Store secrets in \`.env\`. Load with \`npm install dotenv\` → \`require('dotenv').config()\`.
- Access as \`process.env.PORT\`, \`process.env.DB_URL\`, etc.

### 12. CORS
- Install: \`npm install cors\`. Use: \`app.use(cors())\`.
- Allows your API to be called from a different origin (e.g., React frontend).

---

## 🔴 ADVANCED (Topics 13–18)

### 13. REST API Design
- GET /users → list. GET /users/:id → single. POST /users → create.
- PUT /users/:id → replace. PATCH /users/:id → partial update. DELETE /users/:id → delete.
- Always return appropriate status codes: 200, 201, 400, 404, 500.

### 14. Async Route Handlers
- Use \`async/await\` inside route handlers for database calls.
- Wrap in try/catch or use a wrapper function to forward errors to \`next(err)\`.

### 15. Authentication (JWT)
- \`npm install jsonwebtoken bcryptjs\`.
- On login: verify password → sign a JWT → send to client.
- Protected routes: read JWT from Authorization header → verify → allow or 401.

### 16. Connecting to MongoDB (Mongoose)
- \`npm install mongoose\`. Connect with \`mongoose.connect(process.env.MONGO_URI)\`.
- Define a Schema → create a Model → use Model.find(), .create(), .findById(), etc.

### 17. Input Validation
- \`npm install express-validator\`. Chain validation rules on route, run \`validationResult(req)\`.
- Always validate on the server — never trust client input.

### 18. Deployment
- Set \`PORT = process.env.PORT || 3000\` (hosting platforms set PORT automatically).
- Deploy to Railway, Render, or Heroku. Use \`npm start\` script in package.json.
- Never commit .env — use platform environment variable settings.

---

*Topics 1–18 = everything you need to build production Express APIs ✅*
`;

// ─── Topics 1–6: Basics ───────────────────────────────────────────────────────
const topicsBasic = [
  {
    id: 1,
    emoji: "🚂",
    title: "What is Express.js & Why Use It",
    color: "#61DAFB",
    theory: [
      "Express.js is a minimal, unopinionated web framework for Node.js. Node.js can handle HTTP on its own, but Express makes it dramatically easier with routing, middleware, and helper methods.",
      "Without Express, you'd write low-level Node.js http.createServer() code — parsing URLs, methods, and bodies manually for every request. Express abstracts all of that.",
      "Express is the most popular Node.js framework. When people say 'build a backend with Node', they almost always mean Node + Express.",
      "Express is used to build REST APIs, web servers, and full-stack apps (with a template engine like EJS). It can serve JSON to a React frontend or render HTML pages directly.",
      "The MERN stack (MongoDB, Express, React, Node) is one of the most popular full-stack setups — Express is the 'E'.",
    ],
    notes: [
      "Install: npm init -y → npm install express",
      "Express sits on top of Node.js — it doesn't replace it, it enhances it.",
      "Unopinionated means Express doesn't force a folder structure or patterns — you decide.",
      "Popular alternatives: Fastify (faster), Koa (same team, modern async), NestJS (opinionated, TypeScript).",
      "Express is minimal — you add what you need: cors, helmet, morgan, dotenv, etc.",
      "Version 4.x is the current stable version. Express 5 is in beta with better async error handling.",
    ],
    code: `// 1. Install:
// npm init -y
// npm install express

// 2. Basic server — server.js
const express = require('express');
const app = express();

// 3. Register a route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// 4. Start the server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

// Run it:
// node server.js  → OR  npm install -D nodemon → npx nodemon server.js

// Folder structure for a typical Express API:
// my-api/
// ├── server.js         ← entry point
// ├── routes/
// │   ├── users.js      ← user routes
// │   └── posts.js      ← post routes
// ├── controllers/      ← route logic
// ├── models/           ← DB models
// ├── middleware/       ← custom middleware
// ├── .env              ← secrets (never commit)
// └── package.json`,
  },
  {
    id: 2,
    emoji: "🛣️",
    title: "Routing",
    color: "#F7DF1E",
    theory: [
      "Routing means defining which code runs when a specific URL + HTTP method combination is hit. In Express, you define routes with app.get(), app.post(), app.put(), app.delete(), etc.",
      "Each route handler receives two objects: req (the incoming request) and res (the outgoing response). You read from req and write to res.",
      "Route paths can be exact strings ('/users'), strings with parameters ('/users/:id'), or regular expressions. Express matches routes in the order they are defined.",
      "app.route('/path').get(fn).post(fn) lets you chain handlers for the same path — keeping code DRY.",
      "app.all('/path', fn) matches any HTTP method — useful for middleware applied to one route.",
    ],
    notes: [
      "GET → read data. POST → create. PUT → replace. PATCH → partial update. DELETE → delete.",
      "Routes are matched top to bottom — order matters. Put specific routes before wildcard ones.",
      "Route parameters use colon syntax: /users/:id → req.params.id",
      "You can have multiple handlers per route: app.get('/path', middleware, handler)",
      "res.send() ends the response. If you forget it, the request hangs forever.",
      "Every route handler MUST send a response — either res.send(), res.json(), res.redirect(), or res.end().",
    ],
    code: `const express = require('express');
const app = express();

// GET /
app.get('/', (req, res) => {
  res.send('Home page');
});

// GET /about
app.get('/about', (req, res) => {
  res.send('About page');
});

// Route parameter — :id is dynamic
// GET /users/42 → req.params.id = '42'
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: \`User ID: \${id}\` });
});

// Multiple params
// GET /posts/5/comments/3
app.get('/posts/:postId/comments/:commentId', (req, res) => {
  const { postId, commentId } = req.params;
  res.json({ postId, commentId });
});

// Chained handlers on the same path
app.route('/products')
  .get((req, res)  => res.json({ action: 'list all products' }))
  .post((req, res) => res.json({ action: 'create product' }));

app.listen(3000);`,
  },
  {
    id: 3,
    emoji: "📥",
    title: "Request Object (req)",
    color: "#FF6B6B",
    theory: [
      "The req (request) object contains everything about the incoming HTTP request — the URL, method, headers, body, and more.",
      "req.params holds dynamic route segments: for route /users/:id, a request to /users/42 gives req.params.id = '42'.",
      "req.query holds query string parameters: a request to /search?q=express&limit=10 gives req.query.q = 'express' and req.query.limit = '10'.",
      "req.body holds the parsed request body. It's only populated after adding body-parsing middleware like express.json().",
      "req.headers holds all HTTP headers. req.get('Authorization') is a shorthand for reading a specific header.",
    ],
    notes: [
      "req.params → URL path segments like :id. Always strings — convert with Number() if needed.",
      "req.query → query string after ?. Also always strings.",
      "req.body → POST/PUT/PATCH body. Requires express.json() or express.urlencoded() middleware first.",
      "req.method → 'GET', 'POST', etc. req.url → the full URL string.",
      "req.headers → all headers as an object. req.get('Content-Type') → specific header.",
      "req.cookies → parsed cookies (needs cookie-parser middleware).",
      "req.ip → client's IP address. req.path → path without query string.",
    ],
    code: `const express = require('express');
const app = express();
app.use(express.json()); // needed to parse req.body

// ── req.params ──────────────────────────────
// Route: /users/:id
// Request: GET /users/42
app.get('/users/:id', (req, res) => {
  console.log(req.params);  // { id: '42' }
  console.log(req.params.id); // '42'
  res.json({ userId: Number(req.params.id) });
});

// ── req.query ───────────────────────────────
// Request: GET /search?q=express&limit=5&page=2
app.get('/search', (req, res) => {
  console.log(req.query);         // { q: 'express', limit: '5', page: '2' }
  const { q, limit = 10, page = 1 } = req.query;
  res.json({ query: q, limit: Number(limit), page: Number(page) });
});

// ── req.body ────────────────────────────────
// Request: POST /users with JSON body { "name": "Dev", "email": "dev@test.com" }
app.post('/users', (req, res) => {
  console.log(req.body);          // { name: 'Dev', email: 'dev@test.com' }
  const { name, email } = req.body;
  res.status(201).json({ created: { name, email } });
});

// ── req.headers ─────────────────────────────
app.get('/protected', (req, res) => {
  const token = req.get('Authorization'); // or req.headers.authorization
  console.log(token); // 'Bearer abc123...'
  res.json({ token });
});

app.listen(3000);`,
  },
  {
    id: 4,
    emoji: "📤",
    title: "Response Object (res)",
    color: "#A78BFA",
    theory: [
      "The res (response) object is how you send data back to the client. Express adds many helper methods on top of Node's raw response.",
      "res.send() sends text, HTML, or a Buffer. res.json() serializes a JavaScript object to JSON and sets the Content-Type header automatically.",
      "res.status() sets the HTTP status code. Chain it with .json() or .send(): res.status(404).json({ error: 'Not found' }).",
      "res.redirect() sends a redirect response. By default it's 302 (temporary); use res.redirect(301, '/new-url') for permanent.",
      "You can only send one response per request. Sending twice throws a 'Cannot set headers after they are sent' error.",
    ],
    notes: [
      "res.json(obj) → sends JSON + sets Content-Type: application/json automatically.",
      "res.send(str) → sends text/html. res.send(buffer) → sends binary data.",
      "res.status(code) → sets status. Must chain: res.status(201).json(data).",
      "res.redirect('/path') → 302. res.redirect(301, '/path') → permanent 301.",
      "res.sendFile(path) → sends a file. Path must be absolute.",
      "res.set('Header-Name', 'value') → set a custom header.",
      "res.cookie('name', 'value') → set a cookie. res.clearCookie('name') → remove it.",
      "Common status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error.",
    ],
    code: `const express = require('express');
const app = express();
app.use(express.json());

// ── res.json ────────────────────────────────
app.get('/users', (req, res) => {
  const users = [{ id: 1, name: 'Dev' }, { id: 2, name: 'Arjun' }];
  res.json(users);  // 200 OK + JSON body
});

// ── res.status + res.json ───────────────────
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  const newUser = { id: Date.now(), name, email };
  res.status(201).json(newUser);  // 201 Created
});

// ── res.status 404 ──────────────────────────
app.get('/users/:id', (req, res) => {
  const user = getUserById(req.params.id); // pretend DB call

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// ── res.redirect ────────────────────────────
app.get('/old-path', (req, res) => {
  res.redirect('/new-path');         // 302 temporary
});

app.get('/legacy', (req, res) => {
  res.redirect(301, '/modern');      // 301 permanent
});

// ── Custom headers ──────────────────────────
app.get('/data', (req, res) => {
  res.set('X-Custom-Header', 'my-value');
  res.json({ data: 'here' });
});

app.listen(3000);`,
  },
  {
    id: 5,
    emoji: "🔗",
    title: "Middleware",
    color: "#34D399",
    theory: [
      "Middleware functions are functions that run between the request arriving and the route handler executing. They have access to req, res, and a next function.",
      "You MUST call next() at the end of a middleware function to pass control to the next middleware or route handler. If you don't, the request just hangs.",
      "app.use() registers middleware globally (runs on every request). You can also scope middleware to a path: app.use('/api', myMiddleware).",
      "Middleware runs in the order it is defined. This means you must register body-parsing middleware (express.json()) BEFORE any route that reads req.body.",
      "Common built-in middleware: express.json() (parse JSON bodies), express.urlencoded() (parse form data), express.static() (serve files). Popular third-party: morgan (logging), helmet (security headers), cors.",
    ],
    notes: [
      "Middleware signature: (req, res, next) → must call next() or send a response.",
      "app.use(fn) → runs on EVERY request. app.use('/path', fn) → runs only for that path prefix.",
      "Order matters — register middleware before the routes that need it.",
      "express.json() is built-in since Express 4.16+. No need for body-parser package.",
      "You can add multiple middleware in one app.use(): app.use(cors(), helmet(), morgan('dev'))",
      "Route-specific middleware: app.get('/admin', authMiddleware, adminHandler)",
      "Error handling middleware has 4 args: (err, req, res, next) — Express detects this automatically.",
    ],
    code: `const express = require('express');
const app = express();

// ── Built-in middleware ─────────────────────
app.use(express.json());           // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse form data

// ── Custom global middleware ────────────────
app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next(); // MUST call next() or request hangs!
});

// ── Custom auth middleware ──────────────────
function requireAuth(req, res, next) {
  const token = req.get('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
    // note: return prevents calling next() after sending response
  }
  // token is valid — attach user and continue
  req.user = { id: 1, name: 'Dev' }; // attach data to req
  next();
}

// Apply middleware to specific routes only
app.get('/public',    (req, res) => res.json({ msg: 'Anyone can see this' }));
app.get('/dashboard', requireAuth, (req, res) => {
  res.json({ msg: \`Welcome \${req.user.name}\` });
});

// ── Path-scoped middleware ──────────────────
app.use('/api', (req, res, next) => {
  console.log('API request incoming');
  next();
});

app.listen(3000);`,
  },
  {
    id: 6,
    emoji: "📦",
    title: "Body Parsing & express.json()",
    color: "#FB923C",
    theory: [
      "HTTP request bodies are sent as raw text streams. Express doesn't parse them automatically — you need middleware to parse the body into a usable JavaScript object.",
      "express.json() is built-in middleware that parses requests with Content-Type: application/json and makes the result available as req.body.",
      "express.urlencoded({ extended: true }) parses HTML form submissions (application/x-www-form-urlencoded) — needed when your frontend sends a regular HTML form.",
      "You must register these middleware before any route that reads req.body — if you register them after, req.body will be undefined.",
      "For file uploads, you need a dedicated package like multer — express.json() only handles JSON and text, not multipart form data.",
    ],
    notes: [
      "app.use(express.json()) → parses JSON. Required for REST APIs receiving JSON data.",
      "app.use(express.urlencoded({ extended: true })) → parses HTML form submissions.",
      "{ extended: true } uses the qs library for rich objects. { extended: false } uses querystring.",
      "If Content-Type is not application/json, express.json() does nothing — req.body stays undefined.",
      "Request body size limit default is 100kb. Change with: express.json({ limit: '10mb' })",
      "For file uploads: npm install multer. multer handles multipart/form-data.",
      "Always register body parsers at the TOP of your middleware stack, before routes.",
    ],
    code: `const express = require('express');
const app = express();

// ── Register body parsers FIRST ─────────────
app.use(express.json());                         // for application/json
app.use(express.urlencoded({ extended: true })); // for HTML form submissions

// ── JSON body example ───────────────────────
// Client sends: POST /users
// Content-Type: application/json
// Body: { "name": "Devendra", "email": "dev@test.com", "age": 22 }

app.post('/users', (req, res) => {
  console.log(req.body);
  // { name: 'Devendra', email: 'dev@test.com', age: 22 }

  const { name, email, age } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email required' });
  }

  res.status(201).json({ id: Date.now(), name, email, age });
});

// ── Form body example ───────────────────────
// Client sends: POST /login
// Content-Type: application/x-www-form-urlencoded
// Body: username=dev&password=secret

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // req.body = { username: 'dev', password: 'secret' }
  res.json({ username, loggedIn: true });
});

// ── Without body parser (req.body = undefined) ──
// app.post('/broken', (req, res) => {
//   console.log(req.body); // undefined! Forgot to add express.json()
// });

app.listen(3000);`,
  },
];

// ─── Topics 7–12: Intermediate ────────────────────────────────────────────────
const topicsIntermediate = [
  {
    id: 7,
    emoji: "🗂️",
    title: "Express Router",
    color: "#61DAFB",
    theory: [
      "As your app grows, putting all routes in server.js becomes unmanageable. Express Router lets you split routes into separate files — one per resource.",
      "express.Router() creates a mini-app with its own middleware and routes. You define routes on it exactly like app, then mount it on the main app with app.use().",
      "The path you pass to app.use() is the prefix. If you mount a router at /users, all routes inside it are relative to /users — so router.get('/:id') handles GET /users/:id.",
      "This modular pattern is the standard way to organize Express apps. Each router file is a self-contained module — easy to test, maintain, and reason about.",
      "Router-level middleware works the same as app-level middleware but only applies to routes on that router.",
    ],
    notes: [
      "const router = express.Router() → create a router.",
      "router.get(), .post(), .put(), .delete() → same API as app.",
      "app.use('/prefix', router) → mount the router. All router routes are relative to the prefix.",
      "Export the router with module.exports = router, import it in server.js.",
      "Router-level middleware: router.use(fn) → applies only to this router's routes.",
      "router.param('id', fn) → middleware that runs whenever a route contains :id.",
    ],
    code: `// routes/users.js
const express = require('express');
const router  = express.Router();

// All these routes will be prefixed with /users
// (because of how we mount in server.js)

// GET /users
router.get('/', (req, res) => {
  res.json([{ id: 1, name: 'Dev' }, { id: 2, name: 'Arjun' }]);
});

// GET /users/:id
router.get('/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Dev' });
});

// POST /users
router.post('/', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ id: Date.now(), name, email });
});

// PUT /users/:id
router.put('/:id', (req, res) => {
  res.json({ updated: true, id: req.params.id });
});

// DELETE /users/:id
router.delete('/:id', (req, res) => {
  res.json({ deleted: true, id: req.params.id });
});

module.exports = router;

// ─────────────────────────────────────────────
// server.js — mount the router
const express     = require('express');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

const app = express();
app.use(express.json());

app.use('/users', usersRouter); // /users, /users/:id, etc.
app.use('/posts', postsRouter); // /posts, /posts/:id, etc.

app.listen(3000, () => console.log('Running on 3000'));`,
  },
  {
    id: 8,
    emoji: "🚨",
    title: "Error Handling",
    color: "#FF6B6B",
    theory: [
      "Express has a special type of middleware for handling errors — it takes four arguments: (err, req, res, next). Express detects the 4 args and treats it as an error handler.",
      "To trigger error handling, call next(err) with an error object from any route or middleware. Express skips all normal middleware and jumps directly to the error handler.",
      "Place error handling middleware at the very end of your middleware stack — after all routes. Express won't reach it unless next(err) is called.",
      "In async route handlers, errors from awaited calls don't automatically trigger next(err). You must wrap the handler in try/catch and call next(err) in the catch block.",
      "Centralized error handling keeps your route handlers clean — they just throw or call next(err), and the error middleware handles logging and sending the response.",
    ],
    notes: [
      "Error middleware: (err, req, res, next) — 4 args, must be at end of all routes.",
      "Call next(err) to skip to the error handler from any middleware or route.",
      "In async handlers: use try/catch → next(err), or use a wrapper like express-async-errors.",
      "Attach status to error: err.status = 404 → read in error handler for the right code.",
      "Don't call next() after res.json() — use return res.json() to prevent double-send.",
      "404 handler: add a catch-all route app.use((req, res) => res.status(404).json({error:'Not found'})) before the error handler.",
    ],
    code: `const express = require('express');
const app = express();
app.use(express.json());

// ── Normal route — sync ─────────────────────
app.get('/sync-error', (req, res, next) => {
  try {
    throw new Error('Something went wrong!');
  } catch (err) {
    next(err); // pass to error handler
  }
});

// ── Async route — try/catch ─────────────────
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await getUserFromDB(req.params.id); // imaginary DB call
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    res.json(user);
  } catch (err) {
    next(err); // DB error forwarded to error handler
  }
});

// ── 404 catch-all (before error handler) ────
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Error handling middleware (4 args!) ──────
// MUST be last — after all routes and middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  const status  = err.status  || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error:   message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(3000);`,
  },
  {
    id: 9,
    emoji: "🌐",
    title: "Environment Variables & dotenv",
    color: "#A78BFA",
    theory: [
      "Environment variables store configuration values (database URLs, API keys, ports) outside your code — so secrets never end up in your Git repository.",
      "The dotenv package reads a .env file in your project root and loads each variable into process.env, making them available anywhere in your Node.js code.",
      "You call require('dotenv').config() as early as possible — typically the very first line of your entry file (server.js) — so the variables are available before any other code runs.",
      "Always add .env to .gitignore. Share a .env.example file with placeholder values so teammates know what variables are needed.",
      "On production servers (Heroku, Railway, Render), you set environment variables directly in the platform dashboard — no .env file is deployed.",
    ],
    notes: [
      "npm install dotenv → require('dotenv').config() at the top of server.js.",
      ".env format: KEY=value (no spaces, no quotes needed for simple values).",
      "Add .env to .gitignore — NEVER commit secrets to Git.",
      "Create a .env.example with empty values so teammates know what's needed.",
      "Access: process.env.MY_KEY anywhere in Node.js after dotenv.config().",
      "PORT: const PORT = process.env.PORT || 3000 — hosting platforms auto-set PORT.",
      "NODE_ENV: process.env.NODE_ENV === 'production' → toggle production behaviours.",
    ],
    code: `// .env file (never commit!)
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/mydb
JWT_SECRET=my-super-secret-key-change-this
API_KEY=sk-abc123xyz

// .env.example (safe to commit — shows required vars)
PORT=
NODE_ENV=
DATABASE_URL=
JWT_SECRET=
API_KEY=

// server.js — load dotenv FIRST, before anything else
require('dotenv').config(); // load .env → process.env

const express = require('express');
const app = express();

// Now process.env has all variables from .env
const PORT = process.env.PORT || 3000;
const DB   = process.env.DATABASE_URL;

console.log('Connecting to:', DB);

app.get('/', (req, res) => {
  // Never expose secrets in responses!
  res.json({
    env: process.env.NODE_ENV,
    // Don't do: apiKey: process.env.API_KEY  ← security risk
  });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

// .gitignore (make sure this exists!)
// node_modules/
// .env`,
  },
  {
    id: 10,
    emoji: "🔒",
    title: "CORS & Security Headers",
    color: "#34D399",
    theory: [
      "CORS (Cross-Origin Resource Sharing) is a browser security feature that blocks requests from a different origin (domain/port) than the server. When your React frontend at localhost:5173 calls your Express API at localhost:3000, the browser blocks it by default.",
      "The cors npm package adds the right Access-Control-Allow-Origin headers to your responses, telling browsers it's safe to allow cross-origin requests.",
      "You can allow all origins (cors()) for public APIs, or restrict to specific origins (cors({ origin: 'https://myapp.com' })) for production apps.",
      "helmet is a middleware that sets various HTTP headers to protect your app from common web vulnerabilities: XSS, clickjacking, sniffing attacks, etc. It's a one-line security boost.",
      "morgan is a logging middleware that logs every request with method, URL, status, and response time — invaluable for debugging and monitoring.",
    ],
    notes: [
      "npm install cors → app.use(cors()) → allows all origins (fine for development).",
      "Production: cors({ origin: ['https://myapp.com', 'https://admin.myapp.com'] })",
      "CORS is a browser restriction — direct API tools like Postman/Thunder Client are not affected.",
      "npm install helmet → app.use(helmet()) → sets 11 security headers in one line.",
      "npm install morgan → app.use(morgan('dev')) → logs: GET /users 200 5ms",
      "Morgan formats: 'dev' (colorful, concise), 'combined' (Apache format, good for production logs).",
      "Register cors and helmet BEFORE routes so every response gets the headers.",
    ],
    code: `const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

// npm install cors helmet morgan

const app = express();

// ── Security & Logging (register early) ─────
app.use(helmet());        // sets security headers
app.use(morgan('dev'));   // logs: GET /users 200 5.123 ms

// ── CORS — allow all origins (development) ──
app.use(cors());

// ── CORS — specific origins (production) ────
// app.use(cors({
//   origin: ['https://myapp.com', 'https://admin.myapp.com'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true, // allow cookies/auth headers
// }));

app.use(express.json());

app.get('/api/data', (req, res) => {
  res.json({ message: 'This works from any origin!' });
});

// ── Manual CORS headers (without the package) ──
// (just so you understand what cors() does)
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//   next();
// });

app.listen(3000, () => console.log('Server on 3000'));`,
  },
  {
    id: 11,
    emoji: "📁",
    title: "Static Files",
    color: "#F59E0B",
    theory: [
      "Express can serve static files (HTML, CSS, images, JavaScript) from a folder using the built-in express.static() middleware. No routes needed — files are served automatically by their filename.",
      "app.use(express.static('public')) tells Express: 'for any request, first check if a file with that name exists in the public/ folder — if so, serve it directly'.",
      "A request to /logo.png would look for public/logo.png. A request to /css/style.css would look for public/css/style.css.",
      "You can mount static middleware at a virtual prefix: app.use('/assets', express.static('public')) means files are served at /assets/logo.png, not /logo.png.",
      "Static middleware is commonly used to serve a built React/Vue app — point it at the dist/ folder and every /index.html request serves your SPA.",
    ],
    notes: [
      "express.static() is built-in — no extra install needed.",
      "app.use(express.static('public')) → files in public/ served at their path.",
      "app.use('/assets', express.static('public')) → files served at /assets/...",
      "Path must be relative to where you run node from — use path.join(__dirname, 'public') for reliability.",
      "Static files are served before routes — if a file matches, the route never runs.",
      "To serve a React build: app.use(express.static(path.join(__dirname, 'client/dist')))",
      "Catch-all for SPA: app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/dist/index.html')))",
    ],
    code: `const express = require('express');
const path    = require('path'); // built-in Node module
const app     = express();

// ── Serve static files from public/ folder ──
// public/
// ├── index.html
// ├── style.css
// ├── app.js
// └── images/
//     └── logo.png

app.use(express.static(path.join(__dirname, 'public')));
// Requests:
//   GET /          → serves public/index.html
//   GET /style.css → serves public/style.css
//   GET /images/logo.png → serves public/images/logo.png

// ── Virtual prefix ───────────────────────────
app.use('/static', express.static(path.join(__dirname, 'public')));
// Now files are at /static/style.css, /static/images/logo.png

// ── API routes still work normally ──────────
app.get('/api/hello', (req, res) => {
  res.json({ message: 'API still works!' });
});

// ── Serve a built React app (common pattern) ─
app.use(express.static(path.join(__dirname, 'client/dist')));

// Catch-all: serve index.html for any non-API route
// (so React Router works on page refresh)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(3000);`,
  },
  {
    id: 12,
    emoji: "🏛️",
    title: "REST API Design",
    color: "#EF4444",
    theory: [
      "REST (Representational State Transfer) is a convention for designing APIs. A RESTful API maps HTTP methods to CRUD operations on resources.",
      "Resources are nouns (users, posts, products). HTTP methods are verbs. GET /users is 'get all users'. POST /users is 'create a user'. DELETE /users/5 is 'delete user 5'.",
      "Always return appropriate HTTP status codes: 200 (success), 201 (created), 400 (bad request / validation error), 401 (not authenticated), 403 (forbidden), 404 (not found), 500 (server error).",
      "Keep routes consistent: use plural nouns (/users not /user), nest related resources (/users/:id/posts), and never put verbs in URLs (/users/delete/5 is wrong — use DELETE /users/5).",
      "Response bodies should be consistent: always return JSON, always include meaningful error messages, and consider wrapping lists in objects for extensibility ({ data: [...], total: 100 }).",
    ],
    notes: [
      "GET /users → 200, list. GET /users/:id → 200 or 404.",
      "POST /users → 201, created object. PUT /users/:id → 200, full replace. PATCH /users/:id → 200, partial update.",
      "DELETE /users/:id → 200 { deleted: true } or 204 No Content.",
      "Status codes matter: 400 = client mistake, 401 = not logged in, 403 = logged in but no permission, 404 = not found, 500 = server crash.",
      "Nested routes: GET /users/:userId/posts → posts belonging to a user.",
      "Versioning: /api/v1/users — lets you release breaking changes in v2 without breaking v1 clients.",
      "Never put verbs in URLs: /getUsers ❌, /deleteUser ❌. Use HTTP methods instead: GET /users ✅, DELETE /users/:id ✅.",
    ],
    code: `const express = require('express');
const router  = express.Router();

// ── Full CRUD for /api/users ─────────────────

// GET /api/users — list all (with optional filter)
router.get('/', async (req, res) => {
  const { limit = 20, page = 1 } = req.query;
  const users = await User.find().limit(limit).skip((page - 1) * limit);
  res.json({ data: users, page: Number(page) });
});

// GET /api/users/:id — get one
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

// POST /api/users — create
router.post('/', async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email)
      return res.status(400).json({ error: 'name and email are required' });

    const user = await User.create({ name, email });
    res.status(201).json(user);        // 201 Created
  } catch (err) { next(err); }
});

// PATCH /api/users/:id — partial update
router.patch('/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) { next(err); }
});

// DELETE /api/users/:id — delete
router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true, id: req.params.id });
  } catch (err) { next(err); }
});

module.exports = router;`,
  },
];

// ─── Topics 13–18: Advanced ───────────────────────────────────────────────────
const topicsAdvanced = [
  {
    id: 13,
    emoji: "🔐",
    title: "Authentication with JWT",
    color: "#61DAFB",
    theory: [
      "JWT (JSON Web Token) is the most common stateless authentication method for REST APIs. The server issues a signed token; the client sends it back with every request.",
      "On login: verify the password → sign a JWT with a secret → send the token to the client. The token contains a payload (user ID, role) and is signed — tamper-proof.",
      "On protected routes: the client sends the JWT in the Authorization header: 'Bearer <token>'. Middleware verifies the token and attaches the user to req.user.",
      "JWTs are stateless — the server doesn't store sessions. Any server with the same secret can verify the token. This makes them great for scalable APIs.",
      "bcryptjs is used to hash passwords before storing them. Never store plain-text passwords. When a user logs in, compare the input with the stored hash using bcrypt.compare().",
    ],
    notes: [
      "npm install jsonwebtoken bcryptjs",
      "jwt.sign(payload, secret, { expiresIn: '7d' }) → creates a token.",
      "jwt.verify(token, secret) → validates and decodes. Throws if invalid/expired.",
      "bcrypt.hash(password, 10) → hashes with 10 salt rounds. bcrypt.compare(plain, hash) → verifies.",
      "Store the JWT in localStorage (simple) or httpOnly cookies (more secure).",
      "Send token: Authorization: Bearer <token> header.",
      "Never store sensitive data in JWT payload — it's base64 encoded, not encrypted.",
    ],
    code: `const express  = require('express');
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
require('dotenv').config();

const app    = express();
const router = express.Router();
app.use(express.json());

// Fake DB — replace with real DB
const users = [];

// ── Register ─────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields required' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), name, email, password: hashedPassword };
  users.push(user);

  res.status(201).json({ message: 'User created', id: user.id });
});

// ── Login ─────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, email: user.email },   // payload
    process.env.JWT_SECRET,               // secret
    { expiresIn: '7d' }                   // expiry
  );

  res.json({ token });
});

// ── Auth middleware ───────────────────────────
function protect(req, res, next) {
  const header = req.get('Authorization');
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token' });

  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ── Protected route ───────────────────────────
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

app.use('/auth', router);
app.listen(3000);`,
  },
  {
    id: 14,
    emoji: "🍃",
    title: "Connecting to MongoDB (Mongoose)",
    color: "#10B981",
    theory: [
      "Mongoose is an ODM (Object Data Mapper) for MongoDB and Node.js. It adds schemas, models, and validation on top of the raw MongoDB driver.",
      "You define a Schema that describes the shape of your documents — field names, types, required/optional, defaults. Mongoose enforces this schema before saving.",
      "A Model is a class created from a Schema. It gives you methods like User.find(), User.create(), User.findById(), User.findByIdAndUpdate(), User.findByIdAndDelete().",
      "Connect with mongoose.connect(process.env.MONGO_URI). Mongoose queues operations until connected — no need to wait before defining models.",
      "Mongoose automatically creates an _id (ObjectId) for every document. It also handles type coercion — sending a string for a Number field will be cast automatically.",
    ],
    notes: [
      "npm install mongoose",
      "mongoose.connect(uri) → connect to MongoDB. Use MONGO_URI in .env.",
      "new mongoose.Schema({ field: Type }) → define document shape.",
      "mongoose.model('Name', schema) → creates the Model class. Collection = lowercase plural of Name.",
      "Model.find() → all. Model.findById(id) → one. Model.create(data) → insert. Model.findByIdAndUpdate(id, data, { new: true }) → update, return new doc.",
      "Always use await — all Mongoose methods return Promises.",
      "{ new: true } in findByIdAndUpdate → returns the updated document, not the old one.",
    ],
    code: `const mongoose = require('mongoose');
require('dotenv').config();
// npm install mongoose

// ── Connect ───────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err));

// ── Define Schema ─────────────────────────────
const userSchema = new mongoose.Schema({
  name:      { type: String,  required: true, trim: true },
  email:     { type: String,  required: true, unique: true, lowercase: true },
  age:       { type: Number,  min: 0 },
  role:      { type: String,  enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date,    default: Date.now },
});

// ── Create Model ──────────────────────────────
const User = mongoose.model('User', userSchema);
// Collection name in MongoDB will be "users" (lowercase plural)

// ── CRUD operations ───────────────────────────

// Create
const newUser = await User.create({ name: 'Dev', email: 'dev@test.com', age: 22 });

// Find all
const allUsers = await User.find();

// Find with filter
const admins = await User.find({ role: 'admin' });

// Find one by ID
const user = await User.findById('64abc123...');

// Update (returns old by default — use { new: true } for updated doc)
const updated = await User.findByIdAndUpdate(
  '64abc123...',
  { age: 23 },
  { new: true }
);

// Delete
const deleted = await User.findByIdAndDelete('64abc123...');`,
  },
  {
    id: 15,
    emoji: "✅",
    title: "Input Validation",
    color: "#F59E0B",
    theory: [
      "Never trust data coming from the client — always validate and sanitize on the server. Even if you have frontend validation, users can send raw HTTP requests that bypass it.",
      "express-validator provides a chainable API for defining validation rules directly in your route — check for required fields, valid email format, minimum lengths, and more.",
      "You add validation rules as middleware in the route array: [body('email').isEmail(), body('password').isLength({ min: 6 }), yourHandler]. These run before the handler.",
      "In the handler, call validationResult(req) to collect any validation errors. If there are errors, return a 400 with the error list. If none, proceed.",
      "express-validator can also sanitize — trim whitespace, convert to lowercase, escape HTML — reducing security risks alongside validation.",
    ],
    notes: [
      "npm install express-validator",
      "Import: const { body, param, query, validationResult } = require('express-validator')",
      "body('field').notEmpty() → required. .isEmail() → valid email. .isLength({ min: 6 }) → min length.",
      "body('field').trim().toLowerCase() → sanitize: trim spaces, lowercase.",
      ".withMessage('Custom error msg') → custom error message for that rule.",
      "validationResult(req).isEmpty() → true if no errors. .array() → list of errors.",
      "param('id').isMongoId() → validates MongoDB ObjectId format in URL params.",
    ],
    code: `const express = require('express');
const { body, param, validationResult } = require('express-validator');
// npm install express-validator

const app    = express();
const router = express.Router();
app.use(express.json());

// ── Validation rules as middleware array ─────
const validateUser = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 chars'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(), // sanitize: lowercase, remove dots in Gmail

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),

  body('age')
    .optional()
    .isInt({ min: 0, max: 120 }).withMessage('Age must be 0–120'),
];

// ── Use in route ──────────────────────────────
router.post('/users', validateUser, (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    // errors.array() → [{ field: 'email', msg: 'Must be a valid email', value: 'bad' }]
  }

  // Data is valid — proceed
  const { name, email, password } = req.body;
  res.status(201).json({ message: 'User created', name, email });
});

// ── Validate URL param ────────────────────────
router.get('/users/:id',
  param('id').isMongoId().withMessage('Invalid user ID'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    res.json({ id: req.params.id });
  }
);

app.use('/api', router);
app.listen(3000);`,
  },
  {
    id: 16,
    emoji: "🗜️",
    title: "Async Handlers & Error Wrapping",
    color: "#8B5CF6",
    theory: [
      "In Express 4, unhandled promise rejections in async route handlers do NOT automatically trigger the error handling middleware — they just crash silently or leave the request hanging.",
      "The standard solution is wrapping every async handler in try/catch and calling next(err) in the catch block. This is repetitive but reliable.",
      "A cleaner alternative is creating a wrapper function (asyncHandler or catchAsync) that wraps any async function and automatically passes rejections to next(err).",
      "Express 5 (currently in beta) fixes this — async route handlers that throw or reject will automatically call next(err). Until then, wrap them manually or use the express-async-errors package.",
      "The express-async-errors package monkey-patches Express so that any unhandled rejection in async routes automatically goes to the error handler — zero code change needed.",
    ],
    notes: [
      "Express 4: async errors NOT auto-forwarded. Express 5: async errors auto-forwarded.",
      "Pattern 1: try/catch in every handler → next(err) in catch.",
      "Pattern 2: asyncHandler wrapper → const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)",
      "npm install express-async-errors → require('express-async-errors') at top of server.js → done.",
      "Always keep a global error handler as a safety net even with async wrappers.",
      "next(err) skips all normal middleware and routes, jumping directly to the error handler.",
    ],
    code: `// ── Pattern 1: Manual try/catch (verbose) ────
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    next(err); // forward to error handler
  }
});

// ── Pattern 2: asyncHandler wrapper (clean) ──
// Define once, reuse everywhere:
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Now routes are clean — no try/catch needed
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
}));

app.post('/users', asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
}));

// ── Pattern 3: express-async-errors (easiest) ──
// npm install express-async-errors
// At the very top of server.js:
require('express-async-errors'); // patches Express — done!

// Now async routes work like Express 5 — no wrappers needed:
app.get('/posts', async (req, res) => {
  const posts = await Post.find();  // throws? → auto goes to error handler
  res.json(posts);
});

// ── Error handler (always keep this) ─────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});`,
  },
  {
    id: 17,
    emoji: "🚀",
    title: "Project Structure & Best Practices",
    color: "#EC4899",
    theory: [
      "A well-structured Express project separates concerns: routes define paths, controllers contain the logic, models define data shapes, and middleware handles cross-cutting concerns.",
      "The MVC (Model-View-Controller) pattern is common in Express: Models are Mongoose schemas, Controllers are functions with req/res logic, Views are templates (or a frontend app).",
      "Controllers are plain JavaScript functions that hold route handler logic. Separating them from routes keeps files small and makes testing easier.",
      "Services are an optional but powerful layer below controllers — they contain pure business logic with no req/res — making them easily unit-testable.",
      "Always use a consistent response format across your API. Wrapping responses in { success: true, data: ... } or { success: false, error: ... } makes the API predictable for frontend consumers.",
    ],
    notes: [
      "routes/ → define paths + attach controllers. controllers/ → req/res logic. models/ → Mongoose schemas. middleware/ → reusable middleware.",
      "Keep controllers thin: validate input, call a service or model, send response. No business logic.",
      "Use a config/ folder for database connection, constants, etc.",
      "Consistent error objects: create a custom AppError class with status and message.",
      "Use a barrel index.js in each folder to re-export: import { userRoutes } from './routes'",
      "nodemon for dev, pm2 for production process management.",
      "Add a catch-all 404 route BEFORE the error handler, AFTER all other routes.",
    ],
    code: `// Recommended folder structure:
// ├── server.js          ← entry: setup + start
// ├── app.js             ← express app setup (middleware + routes)
// ├── routes/
// │   └── users.js       ← just paths + controller references
// ├── controllers/
// │   └── userController.js  ← req/res logic
// ├── models/
// │   └── User.js        ← Mongoose schema + model
// ├── middleware/
// │   ├── auth.js        ← JWT verification
// │   └── errorHandler.js
// ├── config/
// │   └── db.js          ← mongoose.connect()
// └── .env

// controllers/userController.js
const User = require('../models/User');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

// routes/users.js
const router = require('express').Router();
const { getUsers, getUserById } = require('../controllers/userController');
const protect = require('../middleware/auth');

router.get('/',    protect, getUsers);
router.get('/:id', protect, getUserById);

module.exports = router;

// app.js
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const usersRoute = require('./routes/users');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/users', usersRoute);

module.exports = app;`,
  },
  {
    id: 18,
    emoji: "🌍",
    title: "Deployment",
    color: "#06B6D4",
    theory: [
      "Before deploying, make sure your app uses process.env.PORT — hosting platforms (Heroku, Railway, Render) assign the port dynamically and set the PORT environment variable.",
      "Add a start script to package.json: 'start': 'node server.js'. Hosting platforms run npm start to launch your app.",
      "Never commit your .env file. Set environment variables in the hosting platform's dashboard. Platforms like Railway and Render have a dedicated environment variables section.",
      "Use nodemon in development (npm run dev) but never in production — it restarts on file changes which is wasteful. Use node directly or pm2 for production.",
      "Railway and Render are the easiest platforms for Express deployment — connect your GitHub repo, set env vars, and they auto-deploy on every push.",
    ],
    notes: [
      "const PORT = process.env.PORT || 3000 → always use this pattern.",
      "package.json scripts: 'start': 'node server.js', 'dev': 'nodemon server.js'",
      "Set NODE_ENV=production on the hosting platform — enables optimizations.",
      "Railway: connect GitHub → auto-detects Node.js → deploy. Add env vars in Variables tab.",
      "Render: similar to Railway. Free tier available. Build command: npm install. Start: npm start.",
      "pm2 for production: npm install -g pm2 → pm2 start server.js → pm2 startup (auto-restart on crash).",
      "Add a health check route: app.get('/health', (req, res) => res.json({ status: 'ok' }))",
    ],
    code: `// package.json
{
  "name": "my-express-api",
  "scripts": {
    "start": "node server.js",       ← production
    "dev":   "nodemon server.js"     ← development
  }
}

// server.js — production-ready entry
require('dotenv').config();
const app  = require('./app');      // express app
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

// Connect DB, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
    console.log(\`Environment: \${process.env.NODE_ENV}\`);
  });
});

// config/db.js
const mongoose = require('mongoose');

module.exports = async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1); // exit if DB fails — no point running
  }
};

// Health check route (add in app.js)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// .gitignore
// node_modules/
// .env`,
  },
];

// ─── Interview Categories ──────────────────────────────────────────────────────
const interviewCategories = [
  {
    label: "Core Concepts",
    color: "#61DAFB",
    emoji: "🧠",
    terms: [
      {
        term: "What is Express.js?",
        simple: "A minimal Node.js framework that makes building web servers and REST APIs fast and easy.",
        technical: "Express.js is an unopinionated, minimal web framework built on top of Node.js's http module. It abstracts low-level HTTP parsing into a clean API: routing (app.get/post/etc), middleware (app.use), request parsing (req.body/params/query), and response helpers (res.json/send/status). It doesn't enforce folder structure or patterns — that's left to the developer.",
        tip: "Interview answer: 'Express makes Node.js server code readable. Without it, you'd manually parse URLs, methods, and bodies in every request handler.'",
      },
      {
        term: "What is Middleware?",
        simple: "A function that runs between a request arriving and the route handler responding — used for logging, auth, parsing, etc.",
        technical: "Middleware are functions with the signature (req, res, next). They can read/modify req and res, then call next() to pass control to the next function in the stack. If next() is not called and no response is sent, the request hangs. Middleware is registered with app.use() (global) or per route. Execution order matches registration order — middleware runs top-to-bottom.",
        tip: "The most common interview question on Express. Key points: 3 params (req, res, next), must call next() to continue, order matters, app.use() = global.",
      },
      {
        term: "req vs res",
        simple: "req (request) holds everything about the incoming request. res (response) is used to send data back to the client.",
        technical: "req contains: req.params (URL segments), req.query (query string), req.body (parsed body, needs middleware), req.headers, req.method, req.url, req.ip, req.cookies. res contains methods for sending responses: res.json(), res.send(), res.status(), res.redirect(), res.sendFile(), res.set(), res.cookie(). Both are extended versions of Node's native IncomingMessage and ServerResponse.",
        tip: "Common confusion: req.body is undefined until you add express.json() middleware. This is one of the most common beginner bugs.",
      },
      {
        term: "app.use() vs app.get()",
        simple: "app.use() registers middleware or mounts routers for all methods. app.get() registers a handler only for GET requests.",
        technical: "app.use(path, fn) matches any HTTP method and any path that starts with the given prefix. app.get(path, fn) matches only exact GET requests to that path. app.use() is used for middleware and router mounting. app.get/post/put/delete/patch are used for route handlers. app.use('/api', router) mounts a router so all its routes are prefixed with /api.",
        tip: "app.use() is 'catch everything starting with this path'. app.get() is 'only exact GET to this path'. Use app.use() for middleware; app.get/post for routes.",
      },
      {
        term: "next() function",
        simple: "A function that tells Express to move on to the next middleware or route handler in the stack.",
        technical: "next() is the third argument passed to every middleware. Calling next() without arguments moves to the next middleware/route. Calling next(err) skips all normal middleware and routes and jumps directly to the error-handling middleware (the one with 4 args: err, req, res, next). If neither next() nor a response is sent, the client connection hangs indefinitely.",
        tip: "next vs next(err): no arg = continue normally. With an error = jump to error handler. Forgetting next() in middleware is a very common bug — requests just hang.",
      },
    ],
  },
  {
    label: "Routing & Request",
    color: "#F7DF1E",
    emoji: "🛣️",
    terms: [
      {
        term: "Route Parameters (:param)",
        simple: "Dynamic URL segments defined with a colon — like /users/:id — where the actual value is available as req.params.id.",
        technical: "Route parameters are named URL segments prefixed with ':'. Express captures the value at that position and populates req.params. For /users/:id, a request to /users/42 gives req.params.id = '42' (always a string). Multiple params: /posts/:postId/comments/:commentId. Optional params: /users/:id?. Catch-all: /files/* → req.params[0].",
        tip: "req.params values are always strings. Convert with Number() or parseInt() when expecting a number. forgetting the conversion is a common bug in comparisons.",
      },
      {
        term: "Query Strings (req.query)",
        simple: "Key-value pairs after the ? in a URL — like /search?q=express&limit=10 — available as req.query.q and req.query.limit.",
        technical: "Query strings are parsed automatically by Express and made available as req.query — a plain object. All values are strings by default. Arrays are possible with ?color=red&color=blue → req.query.color = ['red', 'blue']. Use for: pagination (page, limit), filtering, search terms, sorting. Never use query params for sensitive data — they appear in server logs and browser history.",
        tip: "req.params = path segments (/users/:id). req.query = ?after the path. req.body = request body (POST/PUT). Knowing which to use for what data is a core interview topic.",
      },
      {
        term: "Request Body (req.body)",
        simple: "The data sent in the body of a POST/PUT/PATCH request — like a form submission or JSON payload.",
        technical: "HTTP requests can include a body (not for GET/DELETE). Express doesn't parse it by default — you must add middleware. express.json() parses application/json bodies and populates req.body. express.urlencoded() parses HTML form submissions. For multipart (file uploads), use multer. If body parsing middleware isn't added before the route, req.body is undefined.",
        tip: "The single most common beginner bug: req.body is undefined. Cause: forgot app.use(express.json()) or put it after the route definition. Always register body parsers at the top.",
      },
      {
        term: "Express Router",
        simple: "A mini Express app that lets you define routes in a separate file, then mount them on the main app.",
        technical: "express.Router() creates a router instance with its own middleware and route definitions. Export it with module.exports = router, then mount in app.js with app.use('/prefix', router). All routes in the router file are relative to the prefix. Router-level middleware (router.use()) applies only within that router. This is the standard way to organize an Express app by resource (users, posts, auth).",
        tip: "Each Router file = one resource. routes/users.js handles /users. routes/posts.js handles /posts. This is what interviewers expect to see in a real project structure.",
      },
      {
        term: "HTTP Status Codes",
        simple: "Numeric codes in HTTP responses that tell the client what happened — 200 = OK, 404 = not found, 500 = server error.",
        technical: "2xx = success: 200 OK, 201 Created, 204 No Content. 3xx = redirect: 301 Permanent, 302 Temporary. 4xx = client error: 400 Bad Request (invalid input), 401 Unauthorized (not logged in), 403 Forbidden (logged in but no permission), 404 Not Found, 422 Unprocessable Entity (validation fail). 5xx = server error: 500 Internal Server Error. Set with res.status(code).json(body).",
        tip: "Key distinction: 401 = not authenticated (no token / bad token). 403 = authenticated but not authorized (you're logged in but don't have permission). Mix these up and interviewers notice.",
      },
    ],
  },
  {
    label: "Middleware & Error",
    color: "#FF6B6B",
    emoji: "🔗",
    terms: [
      {
        term: "Error Handling Middleware",
        simple: "A special 4-argument middleware (err, req, res, next) that catches errors forwarded via next(err).",
        technical: "Error handling middleware must have exactly 4 parameters: (err, req, res, next). Express detects the arity and treats it as an error handler. Register it after all routes and normal middleware. Trigger it by calling next(err) from any route or middleware — Express skips all normal handlers and jumps to the error middleware. Attach err.status and err.message to control the HTTP response.",
        tip: "Two things trip people up: 1) Forgetting the 4th parameter (next) — Express won't treat it as an error handler. 2) Placing it before routes — errors will never reach it.",
      },
      {
        term: "CORS",
        simple: "A browser security mechanism that blocks requests from a different origin — the cors package tells browsers to allow your API.",
        technical: "CORS (Cross-Origin Resource Sharing) is enforced by browsers. A frontend at http://localhost:5173 calling a backend at http://localhost:3000 is cross-origin. Without CORS headers, the browser blocks the response. The cors package adds Access-Control-Allow-Origin (and other headers) to responses. app.use(cors()) allows all origins. For production, restrict: cors({ origin: 'https://myapp.com' }).",
        tip: "CORS is a browser restriction only. Postman, curl, and server-to-server calls are never blocked by CORS. 'Works in Postman but not in the browser' = CORS issue.",
      },
      {
        term: "helmet",
        simple: "A middleware that sets security-focused HTTP response headers to protect your app from common web attacks.",
        technical: "helmet sets 11 HTTP headers by default: Content-Security-Policy, X-XSS-Protection, X-Frame-Options (prevent clickjacking), X-Content-Type-Options (prevent MIME sniffing), Strict-Transport-Security (HTTPS only), and more. app.use(helmet()) is a one-liner that closes common security gaps. Each header can be individually configured or disabled. Should be registered before routes.",
        tip: "One line — app.use(helmet()) — fixes a dozen common security misconfigurations. Always include it in production. Interviewers appreciate seeing it in your setup.",
      },
      {
        term: "morgan",
        simple: "A logging middleware that prints a line to the console for every incoming request.",
        technical: "morgan is a request logger middleware. npm install morgan. Formats: 'dev' (colorful: GET /users 200 5ms), 'combined' (Apache format with IP, user-agent — good for production logs), 'tiny' (minimal). app.use(morgan('dev')) registers it globally. Morgan logs after the response is sent, so it shows the actual status code and response time.",
        tip: "Use 'dev' format during development for readable output. Switch to 'combined' in production if you want structured logs with IP and user-agent for security auditing.",
      },
      {
        term: "express.static()",
        simple: "Built-in middleware that serves files directly from a folder without needing route handlers.",
        technical: "express.static(root) builds a middleware that serves files from the root directory. For each request, it checks if a matching file exists in the root — if yes, it streams it directly. If not, it calls next(). app.use(express.static('public')) serves files at their natural path. A virtual prefix can be added: app.use('/files', express.static('public')). Commonly used to serve a built React app.",
        tip: "For full-stack deployment: app.use(express.static('client/dist')) + a catch-all app.get('*', sendIndex) pattern makes Express serve your React SPA correctly, including direct URL access and React Router refreshes.",
      },
    ],
  },
  {
    label: "Auth & Security",
    color: "#A78BFA",
    emoji: "🔐",
    terms: [
      {
        term: "JWT (JSON Web Token)",
        simple: "A signed token issued by the server after login — the client sends it back with every request to prove identity.",
        technical: "A JWT has three parts: header (algorithm), payload (claims like userId, role, expiry), and signature (HMAC of header+payload using a secret). It's base64-encoded, not encrypted — don't put sensitive data in the payload. jwt.sign(payload, secret, { expiresIn }) creates a token. jwt.verify(token, secret) validates and decodes it — throws if expired or tampered. Sent as: Authorization: Bearer <token>.",
        tip: "Stateless = no session storage on the server. Any instance can verify the token if it has the secret. This is why JWTs scale well. Downside: can't invalidate a token before expiry without a denylist.",
      },
      {
        term: "bcryptjs",
        simple: "A library for hashing passwords so they're never stored as plain text in the database.",
        technical: "bcrypt uses a one-way adaptive hashing algorithm with a salt (random bytes mixed in to prevent rainbow table attacks). bcrypt.hash(password, rounds) hashes with a cost factor (10–12 rounds is typical). bcrypt.compare(plaintext, hash) checks a login attempt — it hashes the input the same way and compares. The hash stores the salt internally so no separate storage is needed.",
        tip: "Never store plain passwords. bcrypt.compare() is the only correct way to verify — don't hash and compare strings manually. A cost factor of 10 is the standard for most apps.",
      },
      {
        term: "Auth Middleware Pattern",
        simple: "A middleware function that verifies a JWT from the request header and attaches the user to req before the route handler runs.",
        technical: "The protect/authenticate middleware reads the Authorization header, extracts the Bearer token, calls jwt.verify() to validate it. If valid, it attaches the decoded payload to req.user and calls next(). If invalid or missing, it returns 401. This middleware is then added to protected routes: router.get('/me', protect, getMe). It keeps auth logic in one place and reusable across all protected routes.",
        tip: "req.user is the convention for attaching the authenticated user. Downstream handlers read req.user.id instead of repeating JWT verification. This is the standard pattern — know it cold.",
      },
      {
        term: "Environment Variables",
        simple: "Key-value pairs stored outside your code — accessed via process.env — used for secrets and config that changes between environments.",
        technical: "Node.js exposes environment variables via process.env. The dotenv package reads a .env file at startup and populates process.env. .env files should never be committed to Git (add to .gitignore). On hosting platforms (Railway, Render, Heroku), set env vars through the dashboard instead. Common variables: PORT, NODE_ENV, MONGO_URI, JWT_SECRET. NEXT_PUBLIC_ prefix convention is Next.js-specific; plain Express uses no prefix.",
        tip: "The two mistakes interviewers watch for: 1) hardcoding secrets in source code. 2) committing .env to Git. Always use .env + .gitignore + .env.example in your projects.",
      },
      {
        term: "input Validation vs Sanitization",
        simple: "Validation checks if data is correct (required, right format). Sanitization cleans it (trim spaces, escape HTML, lowercase).",
        technical: "Validation rejects bad input before it reaches your database: isEmail(), isLength({ min: 8 }), notEmpty(). Sanitization transforms input to a safe canonical form: trim() removes whitespace, normalizeEmail() lowercases emails, escape() converts < > & to HTML entities (prevents XSS). express-validator chains both: body('email').trim().isEmail().normalizeEmail(). Always do both — validate structure, sanitize content.",
        tip: "Rule: validate first (reject if wrong shape), sanitize before storage (clean what passes). Validation without sanitization is incomplete; you might store spaces or mixed-case emails that break comparisons.",
      },
    ],
  },
  {
    label: "Architecture & Patterns",
    color: "#34D399",
    emoji: "🏗️",
    terms: [
      {
        term: "MVC Pattern in Express",
        simple: "Model-View-Controller: separate your code into data (models), logic (controllers), and routes (the view layer for APIs).",
        technical: "In an Express REST API: Models are Mongoose schemas/classes that represent data and handle DB queries. Controllers are plain functions (exports.getUsers) that handle req/res logic — validate input, call models, send responses. Routes map URLs to controller functions. For APIs there's no View layer — the JSON response is the view. This separation keeps files small and responsibilities clear.",
        tip: "Interviewers often ask about structure. Know this: routes/ (URL mapping), controllers/ (req/res logic), models/ (DB schema + methods), middleware/ (auth, validation), config/ (db connection, constants).",
      },
      {
        term: "REST API Conventions",
        simple: "Consistent rules for naming URLs and using HTTP methods — plural nouns, right HTTP verbs, correct status codes.",
        technical: "REST conventions: use plural resource nouns (/users, /posts). Use HTTP verbs for actions: GET=read, POST=create, PUT=replace, PATCH=partial update, DELETE=delete. Nested resources: /users/:id/posts. Never put verbs in URLs (/getUser is wrong). Return 201 for creation, 204 for no-content deletion. Paginate large lists with ?page=1&limit=20. Version your API: /api/v1/users.",
        tip: "A well-designed REST API is predictable. Given the resource name, any developer can guess the routes. This predictability is what 'RESTful' means in interviews.",
      },
      {
        term: "Async Error Handling",
        simple: "Making sure errors in async route handlers reach the error middleware, since Express 4 doesn't catch them automatically.",
        technical: "Express 4 doesn't catch unhandled promise rejections in async routes — they silently hang or crash. Solutions: 1) try/catch + next(err) in every handler. 2) asyncHandler wrapper: (fn) => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next). 3) require('express-async-errors') package that monkey-patches Express. Express 5 fixes this natively. The error then reaches the 4-argument error middleware.",
        tip: "This is a very common interview topic. Know all three solutions. The asyncHandler wrapper pattern is clean and widely used — be able to write it from memory.",
      },
      {
        term: "Separation of Concerns",
        simple: "Each file and function should have one clear job — routes just route, controllers just handle req/res, models just manage data.",
        technical: "In a clean Express app: routes/users.js only imports controllers and defines paths — no logic. controllers/userController.js only reads req, calls services/models, sends res — no DB schema. models/User.js only defines the Mongoose schema and model — no req/res. middleware/auth.js only verifies JWT. This makes each file independently testable and replaceable without touching other layers.",
        tip: "If your route file has database calls, or your model file has req.body, those are red flags for poor separation of concerns — a common code-review comment.",
      },
      {
        term: "nodemon",
        simple: "A development tool that automatically restarts your server whenever you save a file — no manual node restarts.",
        technical: "nodemon is a CLI that wraps node and watches the file system for changes. When a .js (or configured) file changes, it kills and restarts the process. Install as a dev dependency: npm install -D nodemon. Add to package.json scripts: 'dev': 'nodemon server.js'. Never use nodemon in production — use node directly or pm2 for process management and auto-restart on crash.",
        tip: "Always use the dev script pattern: 'start': 'node server.js' for production, 'dev': 'nodemon server.js' for development. Interviewers notice when devDependencies are in dependencies or nodemon is in start.",
      },
    ],
  },
];

// ─── TopicViewer component ─────────────────────────────────────────────────────
function TopicViewer({ topicList, sectionLabel, topicRange }) {
  const [selected, setSelected] = useState(0);
  const [tab, setTab]           = useState("theory");
  const topic = topicList[selected];

  return (
    <div style={{ fontFamily:"'Fira Code','Courier New',monospace", background:"#0d1117", minHeight:"100vh", display:"flex", color:"#e6edf3" }}>
      {/* Sidebar */}
      <div style={{ width:"220px", minWidth:"220px", background:"#161b22", borderRight:"1px solid #30363d", overflowY:"auto", padding:"16px 0" }}>
        <div style={{ padding:"0 16px 16px", borderBottom:"1px solid #30363d", marginBottom:"8px" }}>
          <div style={{ fontSize:"11px", color:"#8b949e", letterSpacing:"2px", textTransform:"uppercase" }}>{sectionLabel}</div>
          <div style={{ fontSize:"18px", fontWeight:"700", color:"#61DAFB", marginTop:"4px" }}>Topics {topicRange}</div>
        </div>
        {topicList.map((t, i) => (
          <button key={t.id} onClick={() => { setSelected(i); setTab("theory"); }} style={{
            display:"flex", alignItems:"center", gap:"10px", width:"100%",
            padding:"10px 16px", background: selected===i ? "#21262d" : "transparent",
            border:"none", borderLeft: selected===i ? `3px solid ${t.color}` : "3px solid transparent",
            color: selected===i ? "#e6edf3" : "#8b949e", cursor:"pointer", textAlign:"left", fontSize:"12px", transition:"all 0.15s",
          }}>
            <span style={{ fontSize:"16px" }}>{t.emoji}</span>
            <span style={{ lineHeight:"1.3" }}>{t.id}. {t.title}</span>
          </button>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex:1, overflowY:"auto" }}>
        <div style={{ padding:"28px 32px 20px", borderBottom:"1px solid #30363d", background:"#0d1117", position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"16px" }}>
            <span style={{ fontSize:"28px" }}>{topic.emoji}</span>
            <div>
              <span style={{ fontSize:"11px", color:"#8b949e", letterSpacing:"1px" }}>TOPIC {topic.id} OF {topicList.length}</span>
              <h1 style={{ margin:0, fontSize:"22px", color:topic.color }}>{topic.title}</h1>
            </div>
          </div>
          <div style={{ display:"flex", gap:"4px" }}>
            {["theory","notes","code"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding:"6px 16px", borderRadius:"6px", border:"1px solid",
                borderColor: tab===t ? topic.color : "#30363d",
                background:  tab===t ? topic.color+"22" : "transparent",
                color:       tab===t ? topic.color : "#8b949e",
                cursor:"pointer", fontSize:"12px", fontFamily:"inherit", textTransform:"capitalize", letterSpacing:"0.5px",
              }}>
                {t==="theory" ? "📖 Theory" : t==="notes" ? "📌 Notes" : "💻 Code"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding:"28px 32px" }}>
          {tab==="theory" && topic.theory.map((point, i) => (
            <div key={i} style={{ display:"flex", gap:"14px", marginBottom:"16px", padding:"16px", background:"#161b22", borderRadius:"10px", border:"1px solid #30363d", borderLeft:`3px solid ${topic.color}` }}>
              <span style={{ color:topic.color, fontWeight:"bold", fontSize:"14px", minWidth:"20px" }}>{i+1}.</span>
              <p style={{ margin:0, color:"#c9d1d9", lineHeight:"1.7", fontSize:"14px" }}>{point}</p>
            </div>
          ))}

          {tab==="notes" && (
            <div style={{ background:"#161b22", border:"1px solid #30363d", borderRadius:"10px", padding:"20px" }}>
              {topic.notes.map((note, i) => (
                <div key={i} style={{ display:"flex", gap:"10px", padding:"10px 0", borderBottom: i<topic.notes.length-1 ? "1px solid #21262d" : "none" }}>
                  <span style={{ color:topic.color, fontSize:"16px" }}>→</span>
                  <p style={{ margin:0, color:"#c9d1d9", lineHeight:"1.7", fontSize:"14px" }}>{note}</p>
                </div>
              ))}
            </div>
          )}

          {tab==="code" && (
            <div style={{ background:"#161b22", border:"1px solid #30363d", borderRadius:"10px", overflow:"hidden" }}>
              <div style={{ background:"#21262d", padding:"10px 16px", display:"flex", alignItems:"center", gap:"8px", borderBottom:"1px solid #30363d" }}>
                <span style={{ width:10, height:10, borderRadius:"50%", background:"#ff5f57", display:"inline-block" }} />
                <span style={{ width:10, height:10, borderRadius:"50%", background:"#febc2e", display:"inline-block" }} />
                <span style={{ width:10, height:10, borderRadius:"50%", background:"#28c840", display:"inline-block" }} />
                <span style={{ fontSize:"12px", color:"#8b949e", marginLeft:"8px" }}>example.js</span>
              </div>
              <pre style={{ margin:0, padding:"20px", overflowX:"auto", fontSize:"13px", lineHeight:"1.8", color:"#e6edf3", whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
                <code>{topic.code}</code>
              </pre>
            </div>
          )}
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", padding:"20px 32px 32px", gap:"12px" }}>
          <button onClick={() => { setSelected(Math.max(0,selected-1)); setTab("theory"); }} disabled={selected===0} style={{ padding:"10px 20px", borderRadius:"8px", border:"1px solid #30363d", background: selected===0?"#161b22":"#21262d", color: selected===0?"#484f58":"#c9d1d9", cursor: selected===0?"not-allowed":"pointer", fontSize:"13px", fontFamily:"inherit" }}>← Previous</button>
          <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
            {topicList.map((_,i) => (
              <div key={i} onClick={() => { setSelected(i); setTab("theory"); }} style={{ width: selected===i?"20px":"8px", height:"8px", borderRadius:"4px", background: selected===i?topic.color:"#30363d", cursor:"pointer", transition:"all 0.2s" }} />
            ))}
          </div>
          <button onClick={() => { setSelected(Math.min(topicList.length-1,selected+1)); setTab("theory"); }} disabled={selected===topicList.length-1} style={{ padding:"10px 20px", borderRadius:"8px", border:"1px solid #30363d", background: selected===topicList.length-1?"#161b22":"#21262d", color: selected===topicList.length-1?"#484f58":"#c9d1d9", cursor: selected===topicList.length-1?"not-allowed":"pointer", fontSize:"13px", fontFamily:"inherit" }}>Next →</button>
        </div>
      </div>
    </div>
  );
}

// ─── Quick Review ─────────────────────────────────────────────────────────────
function QuickReview() {
  const lines = quickReviewMD.split("\n");
  return (
    <main style={{ maxWidth:820, margin:"2rem auto", padding:"0 1.5rem", fontFamily:"'Fira Code',monospace", color:"#e6edf3" }}>
      {lines.map((line, i) => {
        if (line.startsWith("# "))   return <h1 key={i} style={{ color:"#61DAFB", fontSize:"1.6rem" }}>{line.slice(2)}</h1>;
        if (line.startsWith("## "))  return <h2 key={i} style={{ color:"#F7DF1E", fontSize:"1.1rem", marginTop:"2rem", borderBottom:"1px solid #30363d", paddingBottom:6 }}>{line.slice(3)}</h2>;
        if (line.startsWith("### ")) return <h3 key={i} style={{ color:"#FF6B6B", fontSize:"0.95rem", marginTop:"1.2rem" }}>{line.slice(4)}</h3>;
        if (line.startsWith("- "))   return <p  key={i} style={{ margin:"4px 0", color:"#c9d1d9", fontSize:"0.84rem", paddingLeft:12 }}>→ {line.slice(2)}</p>;
        if (line.trim()==="---")     return <hr key={i} style={{ borderColor:"#30363d", margin:"1rem 0" }} />;
        if (line.trim()==="")        return <br key={i} />;
        return <p key={i} style={{ color:"#c9d1d9", fontSize:"0.84rem", lineHeight:1.7, margin:"6px 0" }}>{line}</p>;
      })}
    </main>
  );
}

// ─── Interview Definitions ─────────────────────────────────────────────────────
function InterviewDefs() {
  const [activeCat,  setActiveCat]  = useState(0);
  const [activeTerm, setActiveTerm] = useState(0);
  const [showTip,    setShowTip]    = useState(false);

  const cat  = interviewCategories[activeCat];
  const item = cat.terms[activeTerm];

  function goToTerm(idx) { setActiveTerm(idx); setShowTip(false); }

  function nextTerm() {
    if (activeTerm < cat.terms.length - 1) { goToTerm(activeTerm + 1); }
    else if (activeCat < interviewCategories.length - 1) { setActiveCat(activeCat + 1); setActiveTerm(0); setShowTip(false); }
  }

  function prevTerm() {
    if (activeTerm > 0) { goToTerm(activeTerm - 1); }
    else if (activeCat > 0) {
      const p = activeCat - 1;
      setActiveCat(p); setActiveTerm(interviewCategories[p].terms.length - 1); setShowTip(false);
    }
  }

  const totalTerms     = interviewCategories.reduce((s, c) => s + c.terms.length, 0);
  const termsBeforeCat = interviewCategories.slice(0, activeCat).reduce((s, c) => s + c.terms.length, 0);
  const globalIndex    = termsBeforeCat + activeTerm + 1;

  return (
    <div style={{ fontFamily:"'Fira Code','Courier New',monospace", background:"#0d1117", minHeight:"100vh", display:"flex", flexDirection:"column", color:"#e6edf3" }}>
      {/* Top bar */}
      <div style={{ background:"#161b22", borderBottom:"1px solid #30363d", padding:"12px 24px", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
        <div>
          <div style={{ fontSize:"11px", color:"#8b949e", letterSpacing:"2px", textTransform:"uppercase" }}>Express.js Interview</div>
          <div style={{ fontSize:"16px", fontWeight:"700", color:"#61DAFB" }}>All Definitions</div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:8, flexWrap:"wrap" }}>
          {interviewCategories.map((c, i) => (
            <button key={i} onClick={() => { setActiveCat(i); setActiveTerm(0); setShowTip(false); }} style={{
              padding:"5px 12px", borderRadius:20, border:"1px solid",
              borderColor: activeCat===i ? c.color : "#30363d",
              background:  activeCat===i ? c.color+"22" : "transparent",
              color:       activeCat===i ? c.color : "#8b949e",
              cursor:"pointer", fontSize:"11px", fontFamily:"inherit",
            }}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        {/* Sidebar */}
        <div style={{ width:"200px", minWidth:"200px", background:"#161b22", borderRight:"1px solid #30363d", overflowY:"auto", padding:"8px 0" }}>
          {cat.terms.map((t, i) => (
            <button key={i} onClick={() => goToTerm(i)} style={{
              display:"block", width:"100%", padding:"9px 14px",
              background: activeTerm===i ? "#21262d" : "transparent",
              border:"none", borderLeft: activeTerm===i ? `3px solid ${cat.color}` : "3px solid transparent",
              color: activeTerm===i ? "#e6edf3" : "#8b949e",
              cursor:"pointer", textAlign:"left", fontSize:"12px",
            }}>
              {t.term}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:"28px 32px" }}>
          {/* Progress */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <span style={{ fontSize:"11px", color:"#8b949e" }}>{globalIndex} / {totalTerms}</span>
            <div style={{ flex:1, height:4, background:"#21262d", borderRadius:2 }}>
              <div style={{ height:4, borderRadius:2, background:cat.color, width:`${(globalIndex/totalTerms)*100}%`, transition:"width 0.3s" }} />
            </div>
            <span style={{ fontSize:"11px", color:cat.color }}>{cat.label}</span>
          </div>

          {/* Term card */}
          <div style={{ background:"#161b22", border:"1px solid #30363d", borderRadius:12, padding:"24px 28px", marginBottom:16, borderTop:`3px solid ${cat.color}` }}>
            <h2 style={{ margin:"0 0 20px", fontSize:"24px", color:cat.color }}>{item.term}</h2>

            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#8b949e", textTransform:"uppercase", marginBottom:8 }}>
                🗣️ Simple Answer (1 sentence)
              </div>
              <p style={{ margin:0, color:"#c9d1d9", lineHeight:1.7, fontSize:"14px", padding:"12px 16px", background:"#0d1117", borderRadius:8, borderLeft:`3px solid ${cat.color}` }}>
                {item.simple}
              </p>
            </div>

            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#8b949e", textTransform:"uppercase", marginBottom:8 }}>
                💻 Technical Answer (for experienced interviewers)
              </div>
              <p style={{ margin:0, color:"#c9d1d9", lineHeight:1.7, fontSize:"14px", padding:"12px 16px", background:"#0d1117", borderRadius:8, borderLeft:"3px solid #30363d" }}>
                {item.technical}
              </p>
            </div>

            <button onClick={() => setShowTip(!showTip)} style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${showTip?"#FBBF24":"#30363d"}`, background: showTip?"#FBBF2422":"transparent", color: showTip?"#FBBF24":"#8b949e", cursor:"pointer", fontSize:"12px", fontFamily:"inherit" }}>
              {showTip ? "Hide" : "Show"} Interview Tip 💡
            </button>

            {showTip && (
              <div style={{ marginTop:12, padding:"12px 16px", background:"#FBBF2411", border:"1px solid #FBBF2444", borderRadius:8, color:"#FBBF24", fontSize:"13px", lineHeight:1.7 }}>
                💡 {item.tip}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display:"flex", justifyContent:"space-between", gap:12 }}>
            <button onClick={prevTerm} disabled={activeCat===0 && activeTerm===0} style={{ padding:"10px 20px", borderRadius:8, border:"1px solid #30363d", background:"#21262d", color:"#c9d1d9", cursor:"pointer", fontSize:"13px", fontFamily:"inherit", opacity: activeCat===0 && activeTerm===0 ? 0.4 : 1 }}>
              ← Previous
            </button>
            <div style={{ display:"flex", gap:5, alignItems:"center", flexWrap:"wrap", justifyContent:"center" }}>
              {cat.terms.map((_,i) => (
                <div key={i} onClick={() => goToTerm(i)} style={{ width: activeTerm===i?18:7, height:7, borderRadius:4, background: activeTerm===i?cat.color:"#30363d", cursor:"pointer", transition:"all 0.2s" }} />
              ))}
            </div>
            <button onClick={nextTerm} disabled={activeCat===interviewCategories.length-1 && activeTerm===cat.terms.length-1} style={{ padding:"10px 20px", borderRadius:8, border:"1px solid #30363d", background:"#21262d", color:"#c9d1d9", cursor:"pointer", fontSize:"13px", fontFamily:"inherit", opacity: activeCat===interviewCategories.length-1 && activeTerm===cat.terms.length-1 ? 0.4 : 1 }}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Home ──────────────────────────────────────────────────────────────────────
function Home() {
  const cards = [
    { label:"⚡ Quick Review",       path:"/quick-review",    desc:"All 18 topics at a glance — read in ~10 min" },
    { label:"🟢 Basics 1–6",         path:"/basic",           desc:"Server, Routing, req, res, Middleware, Body Parsing" },
    { label:"🟡 Intermediate 7–12",  path:"/intermediate",    desc:"Router, Error Handling, Env Vars, CORS, Static, REST" },
    { label:"🔴 Advanced 13–18",     path:"/advanced",        desc:"JWT Auth, MongoDB, Validation, Async, Structure, Deploy" },
    { label:"🎯 Interview Defs",     path:"/interview",       desc:"25 key Express terms — simple + technical + tip" },
  ];
  return (
    <main style={{ maxWidth:900, margin:"3rem auto", padding:"0 1.5rem", fontFamily:"'Fira Code',monospace" }}>
      <h1 style={{ fontSize:"2rem", color:"#e6edf3", marginBottom:".4rem" }}>🚂 Express.js Study Notes</h1>
      <p style={{ color:"#8b949e", marginBottom:"2.5rem" }}>18 topics · 5 sections · full interview prep</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"1rem" }}>
        {cards.map(({ label, path, desc }) => (
          <Link key={path} to={path} style={{ display:"flex", flexDirection:"column", gap:8, background:"#161b22", border:"1px solid #30363d", borderRadius:10, padding:"1.2rem 1.4rem", color:"#e6edf3", textDecoration:"none", transition:"border-color .2s" }}>
            <span style={{ fontWeight:700, fontSize:"0.9rem" }}>{label}</span>
            <span style={{ color:"#8b949e", fontSize:"0.78rem", lineHeight:1.5 }}>{desc}</span>
            <span style={{ color:"#61DAFB", fontSize:"1.1rem", alignSelf:"flex-end" }}>→</span>
          </Link>
        ))}
      </div>
    </main>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
const NAV = [
  { label:"🏠 Home",             path:"/" },
  { label:"⚡ Quick Review",     path:"/quick-review" },
  { label:"🟢 Basics 1–6",       path:"/basic" },
  { label:"🟡 Intermediate 7–12",path:"/intermediate" },
  { label:"🔴 Advanced 13–18",   path:"/advanced" },
  { label:"🎯 Interview Defs",   path:"/interview" },
];

function Navbar() {
  const loc = useLocation();
  return (
    <nav style={{ position:"sticky", top:0, zIndex:200, background:"#161b22", borderBottom:"1px solid #30363d" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 1rem", height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link to="/" style={{ color:"#61DAFB", textDecoration:"none", fontWeight:700, fontSize:"1.05rem", fontFamily:"'Fira Code',monospace" }}>
          🚂 ExpressNotes
        </Link>
        <div style={{ display:"flex", alignItems:"center", gap:"2px", flexWrap:"wrap" }}>
          {NAV.map(({ label, path }) => (
            <Link key={path} to={path} style={{
              color: loc.pathname===path ? "#61DAFB" : "#8b949e",
              textDecoration:"none", padding:"5px 10px", borderRadius:6,
              background: loc.pathname===path ? "#21262d" : "transparent",
              fontSize:"11px", transition:"all 0.15s", fontFamily:"'Fira Code',monospace",
            }}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/quick-review" element={<QuickReview />} />
        <Route path="/basic"        element={<TopicViewer topicList={topicsBasic}        sectionLabel="Express Basics"        topicRange="1–6"  />} />
        <Route path="/intermediate" element={<TopicViewer topicList={topicsIntermediate} sectionLabel="Express Intermediate"  topicRange="7–12" />} />
        <Route path="/advanced"     element={<TopicViewer topicList={topicsAdvanced}     sectionLabel="Express Advanced"      topicRange="13–18"/>} />
        <Route path="/interview"    element={<InterviewDefs />} />
      </Routes>
    </Router>
  );
}
