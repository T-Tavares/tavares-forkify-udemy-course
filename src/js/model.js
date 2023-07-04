// --------------------------- IMPORTS ---------------------------- //

import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { AJAX } from './helpers';
// import { getJSON, sendJSON } from './helpers';

// ------------------------ STATE OBJECT  ------------------------ //

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

// ----------------------- MODEL - RECIPES ------------------------ //
// -------------------------- FUNCTIONS --------------------------- //

function createRecipeObject(data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
}

export async function loadRecipe(id) {
  try {
    // FETCHING RECIPE AND CONVERT JSON FILE
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

    // CONVERT TO JS OBJ WITH BETTER NOMENCLATURE
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err;
  }
}

export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong Ingredients Format! Please use the correct format.'
          );
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQnt = oldQnt * newServings / oldServings
  });
  state.recipe.servings = newServings;
}

// ------------------------ MODEL - SEARCH ------------------------ //
// -------------------------- FUNCTIONS --------------------------- //

export async function loadSearchResults(query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.title,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
}

export function getSearchResultsPerPage(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
}

// ---------------------- MODEL - BOOKMARKS ----------------------- //
// -------------------------- FUNCTIONS --------------------------- //

function persistBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export function addBookmark(recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  persistBookmarks();
}

export function deleteBookmark(id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  persistBookmarks();
}

// ---------------------- DEVELOPER HELPER  ----------------------- //
// -------------------------- FUNCTIONS --------------------------- //

export function clearBookmarks() {
  localStorage.clear('bookmarks');
  state.bookmarks = [];
}

export async function clearMyRecipes() {
  const query = prompt('Type a QUERY for the recipes you want to DELETE.');

  try {
    const searchURL = `${API_URL}?search=${query}&key=${KEY}`;

    // 01. Fetch Recipes
    const res = await fetch(searchURL);
    const { data } = await res.json();

    // 02. Filter Recipes containing ID and return Obj with Titles and IDz
    const recipesOBJ = data.recipes
      .filter(r => r.key)
      .map(rec => {
        return { title: rec.title, id: rec.id };
      });

    // 03. Break Obj into arrays to be used on DELETE req and final Log Msg.
    const recipesAmount = recipesOBJ.length;
    const recipesTitles = recipesOBJ.map(rec => rec.title);
    const recipesIDs = recipesOBJ.map(rec => rec.id);

    // 04. Delete Recipes and Bookmarks
    for await (id of recipesIDs) {
      await fetch(`${API_URL}/${id}?key=${KEY}`, {
        method: 'DELETE',
      });
      deleteBookmark(id);
    }

    // 05. Final Log
    console.log(
      recipesAmount === 0
        ? 'No Recipes to be deleted on this query'
        : `${recipesAmount} ${
            recipesAmount > 1 ? 'Recipes where' : 'Recipe was'
          } Deleted.\n\nHere is a list with them:`
    );
    if (recipesAmount >= 1) console.table(recipesTitles);
  } catch (err) {
    console.error('Error 🧐', err.message);
  }
}

function newFeature() {
  console.log('Welcome to the aplication');
}

// ---------------------------------------------------------------- //
// ------------------------ MODEL - INIT() ------------------------ //
// ---------------------------------------------------------------- //

function init() {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
}

// ---------------------------------------------------------------- //

init();
newFeature();
console.log('hello world');