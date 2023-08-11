const { Router } = require('express')
const dietRouter = Router();
const  { getDietHandler } = require('../handles/dietHandlers')

dietRouter.get('/',getDietHandler)

module.exports = dietRouter
