const { Router } = require('express')
const dietRouter = Router();
const  { getDietByIdHandler, getDietHandler } = require('../handles/dietHandlers')
// const router = require('express').Router();

dietRouter.get('/',getDietHandler)
// dietRouter.get('/:id', getDietByIdHandler)

module.exports = dietRouter
