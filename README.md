# TeamCheck

A full-stack Node.js application with React frontend and Express backend.

## Quick Start

### Option 1: Using the startup script (Recommended)
```bash
./start_application.sh
```

### Option 2: Using npm scripts
```bash
# Start both frontend and backend simultaneously
npm run dev

# Or start them individually
npm run start:backend  # Starts the backend server
npm run start:frontend # Starts the React frontend
```

### Option 3: Manual startup
```bash
# Terminal 1 - Start backend
cd backend
npm start

# Terminal 2 - Start frontend  
cd frontend
npm start
```

## Installation

Install all dependencies for both frontend and backend:
```bash
npm run install:all
```

## Application URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## Project Structure

```
teamcheck/
├── backend/          # Express.js backend
├── frontend/         # React frontend
├── start_application.sh  # Startup script
└── package.json      # Root package.json for managing both apps
```

## Scaling Methodology
1. Implement Database using MSSQL, MongoDB, or PostGresDB to enable storing of user information such as user accounts, settings and passwords. 

2. Implement containerization for quick deployment with integration in GitHub and Amazon Container registry.

3. Implement load balancing and queueing for requests to prevent data from overwriting or front end state errors.

<ul>
    <ul>
      <li>Not doing so could result in issues such as user status getting overwritten, state getting set improperly, API requests being 'crossed'. Important to ensure that requests are debounced or stored in a queue and popped out upon completion.</li>
    </ul>
</ul>

4. Enhance the breakup of components into logical chunks. Maintain the current structure, but further 'modularization' of various components. For example, moving socket handling into its own component, having user login APIs be their own components, status updates, etc.

5. Create comprehensive test suite and swagger documentation for future development and testing. 

6. Create actual authentication and caching. Allow the user to login and retain state for x amount of time. Additionally, implement helmet library for encryption and assignment of a token on successful login.