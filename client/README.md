# E-Commerce Micro-Frontend Application

This is a micro-frontend architecture built with **Module Federation** and **Webpack 5**.

## Architecture Overview

```
├── host/              # Shell/Host application (Main entry point)
├── cart_app/          # Cart micro-frontend
└── products_app/      # Products micro-frontend
```

### Apps Description

- **Host App** (Port 3000): Main application shell that loads and orchestrates micro-frontends
- **Cart App** (Port 3001): Independent cart management micro-frontend
- **Products App** (Port 3002): Independent products listing micro-frontend

## Prerequisites

- Node.js v16+ 
- npm v7+

## Installation

### Step 1: Install Root Dependencies
```bash
npm install
```

### Step 2: Install Dependencies for All Apps
```bash
npm run install-all
```

This will install dependencies in:
- Root directory
- `host/`
- `cart_app/`
- `products_app/`

## Development

### Option 1: Start All Apps Together
```bash
npm start
```
This starts all three apps in parallel:
- Host: http://localhost:3000
- Cart: http://localhost:3001
- Products: http://localhost:3002

### Option 2: Start Individual Apps
```bash
# Host app
cd host && npm start

# Cart app (in another terminal)
cd cart_app && npm start

# Products app (in another terminal)
cd products_app && npm start
```

## Building for Production

### Build All Apps
```bash
npm run build
```

### Build Individual Apps
```bash
# Build host
npm run build:host

# Build cart app
npm run build:cart

# Build products app
npm run build:products
```

## Module Federation Configuration

Each app has a `webpack.config.js` with Module Federation setup:

### Host App
- **Remotes**: Loads Cart and Products as remotes
- **Exposes**: None
- **Port**: 3000

### Cart App
- **Exposes**: `./Cart` component
- **Remotes**: None
- **Port**: 3001

### Products App
- **Exposes**: `./Products` component
- **Remotes**: None
- **Port**: 3002

## File Structure

```
host/
├── src/
│   ├── app.js          # Main App component with routing
│   ├── bootstrap.js    # React DOM rendering
│   ├── index.js        # Entry point with async loading
│   ├── app.css         # App styling
│   └── index.html      # HTML template
├── webpack.config.js   # Webpack + Module Federation config
├── .babelrc            # Babel configuration
└── package.json

cart_app/
├── src/
│   ├── app.js          # Cart component
│   ├── bootstrap.js    # React DOM rendering
│   ├── index.js        # Entry point
│   ├── app.css         # Cart styling
│   ├── index.html      # HTML template
│   └── components/
│       └── Cart.jsx    # Exported Cart component
├── webpack.config.js
├── .babelrc
└── package.json

products_app/
├── src/
│   ├── app.js          # Products component
│   ├── bootstrap.js    # React DOM rendering
│   ├── index.js        # Entry point
│   ├── app.css         # Products styling
│   ├── index.html      # HTML template
│   └── components/
│       └── Products.jsx # Exported Products component
├── webpack.config.js
├── .babelrc
└── package.json
```

## Key Features

✅ **Module Federation**: Each app is independently deployable
✅ **Shared Dependencies**: React and React-DOM are shared to avoid duplication
✅ **Lazy Loading**: Remote modules are dynamically imported with Suspense
✅ **Routing**: React Router for navigation between apps
✅ **Styling**: Individual CSS files for each app
✅ **Development**: Hot module reload with webpack-dev-server

## Troubleshooting

### Port Already in Use
If ports 3000, 3001, or 3002 are already in use, modify the `devServer.port` in each app's `webpack.config.js`.

### Module Not Found
Make sure all apps are running before accessing the host app in browser. Remote entries must be available.

### Dependency Conflicts
Check that all apps have the same version of React and React-DOM for proper sharing.

## Next Steps

1. **Connect to Backend**: Update axios calls to connect to your GraphQL backend
2. **State Management**: Implement Redux or Context API for shared state
3. **Authentication**: Add authentication tokens to API calls
4. **Testing**: Add Jest and React Testing Library
5. **CI/CD**: Set up GitHub Actions for automated builds and deployments
6. **Docker**: Create Docker containers for each micro-frontend

## Resources

- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)

## License

ISC
