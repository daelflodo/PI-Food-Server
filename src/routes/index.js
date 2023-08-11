const { Router } = require('express');
const recipesRouter = require('./recipesRouter')
const dietRouter = require('./dietRouter')

const router = Router();

router.use('/recipes',recipesRouter)
router.use('/diet',dietRouter)

module.exports = router;
