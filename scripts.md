# Scripts Documentation

This document provides comprehensive information about all available NPM scripts in the LoveMatch Thailand project.

## Available Scripts

| Script | Description | Parameters | Example | Troubleshooting |
|--------|-------------|------------|---------|-----------------|
| `dev` | Starts the development server with hot module replacement | `--port`, `--host`, `--open` | `npm run dev --port 3001` | **Error**: Port in use → Use different port or kill process<br>**Error**: Module not found → Run `npm install`<br>**Error**: Permission denied → Check file permissions |
| `build` | Creates optimized production build in `dist/` directory | `--mode`, `--base`, `--outDir` | `npm run build --mode production` | **Error**: Out of memory → Increase Node.js memory: `NODE_OPTIONS="--max-old-space-size=4096" npm run build`<br>**Error**: Type errors → Fix TypeScript issues<br>**Error**: Missing env vars → Check `.env.local` |
| `build:dev` | Creates development build with source maps and debugging info | `--sourcemap`, `--minify false` | `npm run build:dev` | **Error**: Large bundle size → This is expected for dev builds<br>**Error**: Slow build → Consider using `dev` script instead |
| `lint` | Runs ESLint to check code quality and style issues | `--fix`, `--ext`, `--quiet` | `npm run lint --fix` | **Error**: Parsing error → Check TypeScript syntax<br>**Error**: Plugin not found → Run `npm install`<br>**Warning**: Many issues → Run with `--fix` flag |
| `preview` | Serves the production build locally for testing | `--port`, `--host`, `--strictPort` | `npm run preview --port 4173` | **Error**: Build not found → Run `npm run build` first<br>**Error**: Port in use → Use different port<br>**Error**: 404 on routes → Configure SPA fallback |

## Script Details

### Development Script (`dev`)

**Purpose**: Starts the Vite development server with hot module replacement, TypeScript compilation, and live reloading.

**Parameters**:
- `--port <number>`: Specify custom port (default: 8080)
- `--host <string>`: Specify host address (default: localhost)
- `--open [path]`: Automatically open browser
- `--cors`: Enable CORS for development

**Example Usage**:
```bash
# Basic development server
npm run dev

# Custom port
npm run dev -- --port 3001

# Open browser automatically
npm run dev -- --open

# Custom host for network access
npm run dev -- --host 0.0.0.0

# Multiple parameters
npm run dev -- --port 3001 --open --host 0.0.0.0
```

**Expected Output**:
```
  VITE v5.4.1  ready in 1234 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://192.168.1.100:8080/
  ➜  press h to show help
```

**Common Issues**:
- **Port already in use**: Kill the process using the port or use a different port
- **Module resolution errors**: Clear `node_modules` and reinstall dependencies
- **Slow startup**: Check for large files in the project directory

### Build Script (`build`)

**Purpose**: Creates an optimized production build with minification, tree-shaking, and asset optimization.

**Parameters**:
- `--mode <string>`: Build mode (production, development, staging)
- `--base <string>`: Public base path for assets
- `--outDir <string>`: Output directory (default: dist)
- `--emptyOutDir`: Clear output directory before build

**Example Usage**:
```bash
# Standard production build
npm run build

# Staging build
npm run build -- --mode staging

# Custom output directory
npm run build -- --outDir build

# Custom base path for CDN
npm run build -- --base /app/
```

**Expected Output**:
```
✓ 1234 modules transformed.
dist/index.html                 1.23 kB │ gzip:  0.45 kB
dist/assets/index-a1b2c3d4.css  5.67 kB │ gzip:  1.23 kB
dist/assets/index-e5f6g7h8.js  89.12 kB │ gzip: 23.45 kB
✓ built in 12.34s
```

**Performance Optimization**:
- Bundle size should be < 100KB gzipped for main chunk
- Use code splitting for routes and components
- Optimize images and assets before building

### Development Build Script (`build:dev`)

**Purpose**: Creates a development build with source maps, unminified code, and debugging information for testing production-like builds locally.

**Example Usage**:
```bash
# Development build with debugging
npm run build:dev

# Serve the development build
npm run build:dev && npm run preview
```

**Use Cases**:
- Testing production build locally with debugging
- Debugging build-specific issues
- Performance analysis with source maps

### Lint Script (`lint`)

**Purpose**: Runs ESLint to analyze code quality, enforce coding standards, and catch potential bugs.

**Parameters**:
- `--fix`: Automatically fix fixable issues
- `--quiet`: Only report errors, not warnings
- `--ext <extensions>`: File extensions to lint
- `--cache`: Use cache for faster subsequent runs

**Example Usage**:
```bash
# Basic linting
npm run lint

# Fix automatically fixable issues
npm run lint -- --fix

# Only show errors
npm run lint -- --quiet

# Lint specific file types
npm run lint -- --ext .ts,.tsx

# Use cache for faster linting
npm run lint -- --cache
```

**Expected Output**:
```
✓ 123 files linted successfully
⚠ 5 warnings found
✗ 2 errors found

src/components/AuthModal.tsx:45:2
  error  'useState' is not defined  no-undef

src/components/SwipeInterface.tsx:120:5
  warning  'console.log' statement not allowed  no-console
```

**Common Rules Enforced**:
- TypeScript strict type checking
- React hooks rules
- Import/export conventions
- Code formatting standards
- Security best practices

### Preview Script (`preview`)

**Purpose**: Serves the production build locally using Vite's preview server for testing the built application.

**Parameters**:
- `--port <number>`: Custom port (default: 4173)
- `--host <string>`: Host address
- `--strictPort`: Exit if port is already in use
- `--https`: Enable HTTPS

**Example Usage**:
```bash
# Preview production build
npm run preview

# Custom port
npm run preview -- --port 5000

# Enable HTTPS
npm run preview -- --https

# Network access
npm run preview -- --host 0.0.0.0
```

**Prerequisites**:
```bash
# Must build first
npm run build
npm run preview
```

**Expected Output**:
```
  ➜  Local:   http://localhost:4173/
  ➜  Network: http://192.168.1.100:4173/
```

## Advanced Usage Patterns

### Chain Commands

```bash
# Build and preview
npm run build && npm run preview

# Lint, build, and preview
npm run lint && npm run build && npm run preview

# Fix linting issues and rebuild
npm run lint -- --fix && npm run build
```

### Environment-Specific Builds

```bash
# Production build
NODE_ENV=production npm run build

# Staging build with debugging
NODE_ENV=staging npm run build:dev

# Development with specific port
PORT=3001 npm run dev
```

### Performance Monitoring

```bash
# Build with bundle analysis
npm run build -- --mode analyze

# Development with performance metrics
npm run dev -- --debug

# Memory usage monitoring
NODE_OPTIONS="--inspect" npm run dev
```

## Troubleshooting Guide

### General Issues

1. **Clear Cache**: `rm -rf node_modules package-lock.json && npm install`
2. **Check Node Version**: `node --version` (should be >= 18.0.0)
3. **Update Dependencies**: `npm update`
4. **Check Environment**: Verify `.env.local` file exists and has correct values

### Development Issues

- **Hot reload not working**: Check if files are being watched correctly
- **TypeScript errors**: Run `npx tsc --noEmit` to check types
- **Import errors**: Verify path aliases in `vite.config.ts`

### Build Issues

- **Out of memory**: Increase Node.js memory limit
- **Missing assets**: Check public folder and asset imports
- **Environment variables**: Ensure all required vars are set for production

### Performance Issues

- **Slow builds**: Use `--cache` flag where available
- **Large bundle**: Analyze bundle with tools like `webpack-bundle-analyzer`
- **Memory leaks**: Monitor memory usage during development

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm run preview &
      - run: npm run test
```

### Docker Integration

```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```