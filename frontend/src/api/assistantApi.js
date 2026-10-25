import api from './client';

export const assistantApi = {
  getPrompts: () => api.get('/assistant/prompts'),
  chat: (data) => api.post('/assistant/chat', data),
  saveRecipe: (recipe) => api.post('/assistant/recipe/save', recipe),
  getSavedRecipes: () => api.get('/assistant/recipes'),
  deleteSavedRecipe: (recipeId) => api.delete(`/assistant/recipe/${recipeId}`),
};
