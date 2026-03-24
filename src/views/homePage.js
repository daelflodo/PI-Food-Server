/**
 * Returns the HTML string for the server's landing page.
 * Inspired by modern API landing pages — dark theme matching the PI Food client.
 */
const homePage = () => /* html */ `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PI Food API</title>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
    rel="stylesheet"
  />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', sans-serif;
      background: #0a0a0b;
      color: #e2e2ea;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 1.5rem 5rem;
    }

    /* ── Glow orb ── */
    .orb {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #ffb347, #ff6b2b 60%, #f59e0b);
      box-shadow: 0 0 48px 20px rgba(255, 107, 43, 0.35);
      margin-bottom: 1.75rem;
      animation: glow 3s ease-in-out infinite;
    }

    @keyframes glow {
      0%, 100% { box-shadow: 0 0 48px 20px rgba(255, 107, 43, 0.35); }
      50%       { box-shadow: 0 0 72px 32px rgba(255, 107, 43, 0.55); }
    }

    /* ── Header ── */
    .header { text-align: center; margin-bottom: 3rem; }

    h1 {
      font-size: 2.75rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #ff6b2b 0%, #f59e0b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.6rem;
    }

    .version {
      display: inline-block;
      padding: 0.22rem 0.9rem;
      background: rgba(255, 107, 43, 0.12);
      border: 1px solid rgba(255, 107, 43, 0.3);
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #ff9a6b;
      letter-spacing: 0.04em;
      margin-bottom: 1rem;
    }

    .desc {
      color: #7b7b9b;
      font-size: 0.95rem;
      max-width: 540px;
      line-height: 1.75;
      margin: 0 auto;
    }

    .desc strong { color: #a0a0c0; font-weight: 600; }

    /* ── Endpoint grid ── */
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      max-width: 860px;
      width: 100%;
      margin-bottom: 2.75rem;
    }

    @media (max-width: 680px) { .grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 440px) { .grid { grid-template-columns: 1fr; } }

    .card {
      background: #111115;
      border: 1px solid #1e1e26;
      border-radius: 14px;
      padding: 1.25rem 1.15rem;
      transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    }

    .card:hover {
      border-color: rgba(255, 107, 43, 0.4);
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    }

    /* ── HTTP method badges ── */
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      font-family: 'Courier New', monospace;
      margin-bottom: 0.6rem;
    }

    .get    { background: rgba(34, 197, 94,  0.12); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }
    .post   { background: rgba(59, 130, 246, 0.12); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2); }
    .put    { background: rgba(245, 158, 11, 0.12); color: #fbbf24; border: 1px solid rgba(245,158,11,0.2); }
    .delete { background: rgba(239, 68,  68, 0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }

    .route {
      font-family: 'Courier New', monospace;
      font-size: 0.88rem;
      font-weight: 600;
      color: #dedeed;
      margin-bottom: 0.35rem;
    }

    .card-desc { font-size: 0.78rem; color: #5e5e7a; line-height: 1.5; }

    /* ── CTA button ── */
    .cta {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.9rem 2.4rem;
      background: linear-gradient(135deg, #ff6b2b 0%, #f59e0b 100%);
      border: none;
      border-radius: 999px;
      color: #fff;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.01em;
      cursor: pointer;
      text-decoration: none;
      box-shadow: 0 4px 24px rgba(255, 107, 43, 0.4);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .cta:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 40px rgba(255, 107, 43, 0.6);
    }

    /* ── Footer ── */
    footer {
      margin-top: 3.5rem;
      color: #2e2e42;
      font-size: 0.73rem;
      letter-spacing: 0.04em;
      text-align: center;
    }

    footer span { color: #3e3e58; }
  </style>
</head>
<body>

  <div class="orb"></div>

  <div class="header">
    <h1>PI Food API</h1>
    <div class="version">V 1.0.0</div>
    <p class="desc">
      REST API para explorar y gestionar recetas culinarias.<br />
      Integración con <strong>Spoonacular API</strong>, persistencia en
      <strong>PostgreSQL</strong> y soporte para recetas personalizadas con imágenes en <strong>Cloudinary</strong>.
    </p>
  </div>

  <div class="grid">

    <div class="card">
      <span class="badge get">GET</span>
      <div class="route">/recipes</div>
      <div class="card-desc">Listar todas las recetas (DB + Spoonacular)</div>
    </div>

    <div class="card">
      <span class="badge get">GET</span>
      <div class="route">/recipes?name=</div>
      <div class="card-desc">Buscar recetas por nombre</div>
    </div>

    <div class="card">
      <span class="badge get">GET</span>
      <div class="route">/recipes/:id</div>
      <div class="card-desc">Obtener receta por ID (UUID o numérico)</div>
    </div>

    <div class="card">
      <span class="badge post">POST</span>
      <div class="route">/recipes</div>
      <div class="card-desc">Crear nueva receta (persiste en DB)</div>
    </div>

    <div class="card">
      <span class="badge put">PUT</span>
      <div class="route">/recipes</div>
      <div class="card-desc">Actualizar receta existente por UUID</div>
    </div>

    <div class="card">
      <span class="badge delete">DELETE</span>
      <div class="route">/recipes/:id</div>
      <div class="card-desc">Eliminar receta de la base de datos</div>
    </div>

    <div class="card">
      <span class="badge get">GET</span>
      <div class="route">/diet</div>
      <div class="card-desc">Listar todos los tipos de dieta</div>
    </div>

  </div>

  <a class="cta" href="/api-docs">Ver Documentación →</a>

  <footer>
    Express &nbsp;<span>·</span>&nbsp; Sequelize &nbsp;<span>·</span>&nbsp;
    PostgreSQL &nbsp;<span>·</span>&nbsp; Spoonacular API &nbsp;<span>·</span>&nbsp; Cloudinary
  </footer>

</body>
</html>`;

module.exports = homePage;
