const { Router } = require('express');
const recipesRouter = require('./recipesRouter')
const dietRouter = require('./dietRouter')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const router = Router();
// const getRecipeById = require('../controllers/getRecipeById')

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/recipes',recipesRouter)
router.use('/diet',dietRouter)


module.exports = router;
