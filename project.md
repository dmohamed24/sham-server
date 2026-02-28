# 🛠️ Project Guide: Mock API Server (Node.js)

## What You're Building

A command-line tool that reads a JSON or YAML config file and spins up a local HTTP server
that serves fake API endpoints. Think of it as a lightweight, personal version of tools like
Mockoon or json-server — but one you built yourself.

**Example use case:** Your frontend team needs to start building before the real backend is
ready. You define the expected endpoints and responses in a config file, run your tool, and the
frontend team can develop against it immediately.

---

## Aim of the Project

By the end of this project your tool should be able to:

- Accept a config file path as a CLI argument (e.g. `mock-api start ./api.json`)
- Parse that config file and register HTTP routes dynamically
- Respond to requests with the correct status code, headers, and body defined in the config
- Support all common HTTP methods: GET, POST, PUT, PATCH, DELETE
- Optionally add a delay to responses to simulate real network latency
- Log incoming requests to the terminal in a readable format
- Watch the config file for changes and hot-reload routes without restarting the server

---

## Example Config File

This is what a user would write to define their fake API:

```json
{
  "port": 3000,
  "routes": [
    {
      "method": "GET",
      "path": "/users",
      "status": 200,
      "delay": 500,
      "response": {
        "users": [
          { "id": 1, "name": "Alice" },
          { "id": 2, "name": "Bob" }
        ]
      }
    },
    {
      "method": "POST",
      "path": "/users",
      "status": 201,
      "response": {
        "message": "User created successfully"
      }
    },
    {
      "method": "GET",
      "path": "/users/:id",
      "status": 200,
      "response": {
        "id": 1,
        "name": "Alice",
        "email": "alice@example.com"
      }
    },
    {
      "method": "POST",
      "path": "/login",
      "status": 200,
      "match": {
        "body": { "username": "admin" },
        "headers": { "content-type": "application/json" }
      },
      "response": {
        "body": { "message": "Welcome back", "token": "abc123" },
        "headers": {
          "Set-Cookie": "session=abc123; HttpOnly",
          "Content-Type": "application/json"
        }
      }
    },
    {
      "method": "GET",
      "path": "/profile",
      "status": 200,
      "match": {
        "cookies": { "session": "abc123" }
      },
      "response": {
        "body": { "user": "admin", "email": "admin@example.com" }
      }
    }
  ]
}
```

---

## Project Structure

```
mock-api-server/
├── bin/
│   └── cli.js          # Entry point, handles CLI args
├── src/
│   ├── server.js       # Creates and starts the Express server
│   ├── router.js       # Reads config and registers routes dynamically
│   ├── loader.js       # Parses JSON/YAML config files
│   └── watcher.js      # Watches config file for changes (hot reload)
├── examples/
│   └── api.json        # Example config file for testing
├── package.json
└── README.md
```

---

## Topics to Learn & Research

Work through these roughly in order as you build each piece of the project.

### 1. Building a CLI with Node.js

Your tool needs to be invocable from the terminal like `mock-api start ./api.json`.
Understanding how to handle command-line arguments is the first step.

- **`process.argv`** — the raw array of arguments passed to a Node process
- **`commander`** — the most popular Node.js library for building CLIs. Learn how to define
  commands, options, and flags (e.g. `--port`, `--watch`)
- **`package.json` `bin` field** — how to make your script globally executable via `npm link`

Key questions to answer:

- How do I define a subcommand like `start`?
- How do I accept a required positional argument (the config file path)?
- How do I add an optional `--port` flag that overrides the port in the config?

---

### 2. Reading & Parsing Config Files

Your tool needs to read a file from disk and parse it into a JavaScript object.

- **`fs` module** — specifically `fs.readFileSync` and `fs.promises.readFile`
- **`path` module** — `path.resolve`, `path.extname` for handling file paths safely
- **`JSON.parse`** — built-in JSON parsing
- **`js-yaml`** — third-party library for parsing YAML files

Key questions to answer:

- How do I detect whether the file is JSON or YAML based on its extension?
- How do I handle errors gracefully if the file doesn't exist or has invalid syntax?
- What does a good error message look like for a CLI tool?

---

### 3. Building an HTTP Server with Express

The core of the project. You'll use Express to create an HTTP server and register routes
dynamically based on what's in the config.

- **`express`** — the defacto Node.js HTTP framework. Learn `app.get()`, `app.post()`,
  `app.use()`, `app.listen()`
- **Dynamic route registration** — how to loop over your config's routes array and call
  `app[method](path, handler)` for each one
- **Route parameters** — how Express handles `:id` style params via `req.params`
- **`res.status().json()`** — sending JSON responses with a specific status code
- **Middleware** — understand `express.json()` for parsing request bodies

Key questions to answer:

- How do I register routes from a loop rather than hardcoding them?
- How do I delay a response by N milliseconds? (hint: `setTimeout` wrapped in a Promise)
- How do I send back the response body from the config file as JSON?

---

### 4. Request Logging

When a request comes in, print a clean log line to the terminal so the user can see what's
happening.

- **`morgan`** — a popular Express middleware for HTTP request logging
- Writing a **custom middleware function** — how `(req, res, next) => {}` works in Express
- **`chalk`** or **`kleur`** — terminal color libraries to make logs readable (e.g. green for
  200, red for 500)

Key questions to answer:

- What information is useful to log? (method, path, status code, response time)
- How do I write my own middleware vs using an existing one like morgan?
- How do I color output in the terminal?

---

### 5. File Watching & Hot Reload

When the user edits their config file, the server should pick up the changes automatically
without needing a restart.

- **`fs.watch`** — Node's built-in file watching API (has some quirks)
- **`chokidar`** — a more reliable cross-platform file watcher, widely used
- The concept of **re-registering routes** — you'll need to clear existing routes and
  re-register them when the config changes

Key questions to answer:

- What are the limitations of `fs.watch` and why does `chokidar` exist?
- How do I clear all registered routes from an Express app and re-add them?
- How do I debounce the file watcher so it doesn't fire 10 times on a single save?

---

### 6. Error Handling & Edge Cases

A good CLI tool doesn't crash silently or print unhelpful stack traces.

- **`try/catch`** blocks around file reading and JSON parsing
- **Process exit codes** — `process.exit(1)` for errors, `process.exit(0)` for clean exits
- **Handling `SIGINT`** — what happens when the user presses Ctrl+C
- **Port conflicts** — what to do if the requested port is already in use

Key questions to answer:

- How do I catch an `EADDRINUSE` error when a port is already occupied?
- How do I validate the config file schema before trying to use it?

---

## Packages to Install

```bash
npm install express commander js-yaml chokidar chalk
npm install --save-dev nodemon
```

| Package     | Purpose                         |
| ----------- | ------------------------------- |
| `express`   | HTTP server and routing         |
| `commander` | CLI argument parsing            |
| `js-yaml`   | YAML config file support        |
| `chokidar`  | File watching for hot reload    |
| `chalk`     | Coloured terminal output        |
| `nodemon`   | Auto-restart during development |

---

## Milestones (Build in This Order)

Work through these one at a time. Each milestone produces something runnable.

**Milestone 1 — Basic CLI**
Get a script running from the terminal that accepts a file path argument and prints it out.

**Milestone 2 — Config Parsing**
Read and parse the JSON config file. Print the parsed routes to the terminal to verify it works.

**Milestone 3 — Static Server**
Start an Express server on the configured port with manually hardcoded routes to confirm
Express is working.

**Milestone 4 — Dynamic Routes**
Loop over the parsed config and register routes dynamically. Test with curl or a REST client.

**Milestone 5 — Response Delay**
Add support for the `delay` field. Requests to those routes should wait before responding.

**Milestone 6 — Request Logging**
Print a log line to the terminal for every incoming request.

**Milestone 7 — Hot Reload**
Watch the config file with chokidar and re-register routes when it changes.

**Milestone 8 — Polish**
Add good error messages, handle edge cases, and make it installable globally via `npm link`.

---

## Stretch Goals

Once the core is working, here are ways to extend the project:

- **YAML support** — allow config files to be written in YAML as well as JSON
- **Response templating** — support dynamic values in responses using `{{param.id}}` syntax
  pulled from route params or query strings
- **Proxy fallback** — if a route isn't defined in the config, proxy the request to a real
  backend URL
- **Admin UI** — serve a simple HTML page at `/__admin` that lists all registered routes
- **Request recording** — log all incoming requests to a file so you can replay them later
- **Schema validation** — use `zod` or `joi` to validate the config file structure and give
  friendly error messages

---

## Useful Commands to Test Your Server

```bash
# Basic GET request
curl http://localhost:3000/users

# POST with a JSON body
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Charlie"}'

# GET with a route param
curl http://localhost:3000/users/1

# Check response headers and status code
curl -i http://localhost:3000/users
```

---

## Resources

- [Express.js Docs](https://expressjs.com/)
- [Commander.js Docs](https://github.com/tj/commander.js)
- [Chokidar Docs](https://github.com/paulmillr/chokidar)
- [Node.js `fs` Docs](https://nodejs.org/api/fs.html)
- [Node.js `path` Docs](https://nodejs.org/api/path.html)
- [js-yaml Docs](https://github.com/nodeca/js-yaml)

---

_Good luck! The goal isn't just to finish the project — it's to understand every line you write._
