const axios = require('axios');
const fallbackRecipes = require('../utils/los100');

const { API_KEY } = process.env;
const BASE_URL = 'https://api.spoonacular.com/recipes';

const fetchRecipes = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/complexSearch`, {
      params: { apiKey: API_KEY, number: 100, addRecipeInformation: true },
    });

    if (data.status === 'failure') {
      console.warn(`Spoonacular API failure (${data.code}): ${data.message}. Using local fallback data.`);
      return fallbackRecipes;
    }

    return data.results;
  } catch (error) {
    const status = error.response?.status;
    if (status === 402 || status === 429) {
      console.warn(`Spoonacular API limit reached (${status}). Using local fallback data.`);
      return fallbackRecipes;
    }
    throw error;
  }
};

const fetchRecipeById = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/${id}/information`, {
    params: { apiKey: API_KEY },
  });
  return data;
};

module.exports = { fetchRecipes, fetchRecipeById };
