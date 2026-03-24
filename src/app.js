const express        = require('express');
const cookieParser   = require('cookie-parser');
const morgan         = require('morgan');
const cors           = require('cors');
const swaggerUi      = require('swagger-ui-express');
const swaggerSpec    = require('./swagger');
const homePage       = require('./views/homePage');
const routes         = require('./routes');

const server = express();

server.use(cors());
server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ extended: true, limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));

// ── Landing page ──────────────────────────────────────────────
server.get('/', (_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(homePage());
});

// ── Swagger UI ────────────────────────────────────────────────
server.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'PI Food API Docs',
    customCss: `
      .swagger-ui .topbar { background: #0a0a0b; border-bottom: 1px solid #1e1e26; }
      .swagger-ui .topbar-wrapper img { content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text y="18" font-size="18">🍳</text></svg>'); height: 30px; }
      .swagger-ui .info h2.title { color: #ff6b2b; }
      body { background: #0d0d10 !important; }
    `,
  }),
);

// ── Swagger JSON spec (for external consumers) ────────────────
server.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

server.use(routes);

// ── Error handling middleware ──────────────────────────────────
server.use((err, _req, res, _next) => { // eslint-disable-line no-unused-vars
  const status  = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

module.exports = server;

