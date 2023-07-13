// --------------------------- IMPORTS ---------------------------- //
import 'dotenv/config';
import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, API_KEY, DEV_PASS } from './config';
// import { API_URL, RES_PER_PAGE, KEY, DEV_PASS } from './config';
import { AJAX } from './helpers';

// ------------------------ STATE OBJECT  ------------------------ //

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  clearedRecipes: {
    ids: [],
    titles: [],
    amount: 0,
  },
  bookmarks: [],
  devLogged: false,
};

// ----------------------- MODEL - OPENING ------------------------ //
// -------------------------- FUNCTIONS --------------------------- //

function randomArrEl(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function fetchRandomRecipe() {
  const randomQueryArr = ['pizza', 'salad', 'dip', 'pasta', 'rice'];
  const query = randomArrEl(randomQueryArr);

  const dataRaw = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

  return randomArrEl(dataRaw.data.recipes);
}

export async function fetchRandomRecipesArr(num) {
  const recipesArr = [];

  for (let i = 1; num >= i; i++) {
    const recipeRaw = await fetchRandomRecipe();
    const recipeObj = {
      id: recipeRaw.id,
      title: recipeRaw.title,
      publisher: recipeRaw.publisher,
      sourceUrl: recipeRaw.source_url,
      image: recipeRaw.image_url,
      servings: recipeRaw.servings,
      cookingTime: recipeRaw.cooking_time,
      ingredients: recipeRaw.ingredients,
      ...(recipeRaw.key && { key: recipeRaw.key }),
    };
    recipesArr.push(recipeObj);
  }
  return recipesArr;
}

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
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);

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

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
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
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

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

export function devLoginCheck(input) {
  if (+input === +DEV_PASS) state.devLogged = true;
  else throw new Error('Wrong Password');
}

export function clearBookmarks() {
  localStorage.clear('bookmarks');
  state.bookmarks = [];
}

export async function clearMyRecipes(query) {
  try {
    const searchURL = `${API_URL}?search=${query}&key=${API_KEY}`;

    // 01. Fetch Recipes
    const res = await fetch(searchURL);
    const { data } = await res.json();

    // 02. Filter Recipes containing ID and return Obj with Titles and IDz
    const recipesOBJ = data.recipes
      .filter(r => r.key)
      .map(rec => {
        return { title: rec.title, id: rec.id };
      });

    // 03. Fill state with latest cleared recipes (will be used on DevLog())
    state.clearedRecipes.amount = recipesOBJ.length;
    state.clearedRecipes.titles = recipesOBJ.map(rec => rec.title);
    state.clearedRecipes.id = recipesOBJ.map(rec => rec.id);

    // 04. Delete Recipes and Bookmarks
    for await (id of state.clearedRecipes.id) {
      await fetch(`${API_URL}/${id}?key=${API_KEY}`, {
        method: 'DELETE',
      });
      deleteBookmark(id);
    }
  } catch (err) {
    console.error('Error 🧐', err.message);
  }
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
