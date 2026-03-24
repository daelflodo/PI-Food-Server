const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PI Food API',
      version: '1.0.0',
      description:
        'REST API for exploring and managing culinary recipes. ' +
        'Combines data from the **Spoonacular API** with a local PostgreSQL database ' +
        'and supports full CRUD operations on custom recipes.',
      contact: { name: 'David Flores' },
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Recipes', description: 'Recipe endpoints — DB + Spoonacular integration' },
      { name: 'Diets',   description: 'Dietary category endpoints' },
    ],
    components: {
      schemas: {
        Recipe: {
          type: 'object',
          properties: {
            id:          { type: 'string',  example: 'a1b2c3d4-… or 12345' },
            name:        { type: 'string',  example: 'Carbonara Pasta' },
            image:       { type: 'string',  example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
            summary:     { type: 'string',  example: 'A classic Roman pasta dish.' },
            healthScore: { type: 'integer', example: 72 },
            steps:       { type: 'string',  example: '1. Boil water…\n2. Cook pasta…' },
            diets:       { type: 'array', items: { type: 'string' }, example: ['vegetarian', 'lacto vegetarian'] },
          },
        },
        RecipeInput: {
          type: 'object',
          required: ['name', 'image', 'summary', 'healthScore', 'steps', 'diets'],
          properties: {
            name:        { type: 'string',  example: 'Carbonara Pasta' },
            image:       { type: 'string',  example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
            summary:     { type: 'string',  example: 'A classic Roman pasta dish.' },
            healthScore: { type: 'integer', minimum: 0, maximum: 100, example: 72 },
            steps:       { type: 'string',  example: '1. Boil water…\n2. Cook pasta…' },
            diets:       { type: 'array', items: { type: 'string' }, example: ['vegetarian'] },
          },
        },
        RecipeUpdate: {
          type: 'object',
          required: ['id'],
          properties: {
            id:          { type: 'string',  example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
            name:        { type: 'string' },
            image:       { type: 'string' },
            summary:     { type: 'string' },
            healthScore: { type: 'integer', minimum: 0, maximum: 100 },
            steps:       { type: 'string' },
            diets:       { type: 'array', items: { type: 'string' } },
          },
        },
        Diet: {
          type: 'object',
          properties: {
            id:   { type: 'integer', example: 1 },
            name: { type: 'string',  example: 'Vegan' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Recipe not found' },
          },
        },
        SuccessMessage: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Recipe deleted successfully' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
