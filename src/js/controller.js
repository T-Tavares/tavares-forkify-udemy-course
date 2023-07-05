import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import devMenuView from './views/devMenuView.js';
import devLoginView from './views/devLoginView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

///////////////////////////////////////

// --------------------- CONTROLLER - RECIPES --------------------- //
// -------------------------- FUNCTIONS --------------------------- //

async function controlRecipes() {
  try {
    // GET HASH - RECIPE ID
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPerPage());

    // UPDATING BOOKMARKS VIEW
    bookmarksView.update(model.state.bookmarks);

    // Loading recipe
    await model.loadRecipe(id);

    // RENDERING RECIPE
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
}

function controlServings(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

async function controlAddRecipe(newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render Recipe and bookmark
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);

    // Sucess Message
    addRecipeView.renderMessage();

    // Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`); // changes url without reload page

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('💥', err);
    addRecipeView.renderError(err.message);
  }
  location.reload();
}

// -------------------- CONTROLLER - SEARCHES --------------------- //
// -------------------------- FUNCTIONS --------------------------- //

async function controlSearchResults() {
  try {
    resultsView.renderSpinner();
    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Loading recipes
    await model.loadSearchResults(query);

    // 3.  Rendering results
    resultsView.render(model.getSearchResultsPerPage(1));

    // 4. Rendering Pagination
    paginationView.render(model.state.search);
  } catch (err) {}
}

function controlPagination(goToPage) {
  // 1.  Rendering results
  resultsView.render(model.getSearchResultsPerPage(goToPage));

  // 2. Rendering Pagination
  paginationView.render(model.state.search);
}

// -------------------- CONTROLLER - BOOKMARKS -------------------- //
// -------------------------- FUNCTIONS --------------------------- //

function controlAddBookmark() {
  /* 
  !model.state.recipe.bookmarked
    ? model.addBookmark(model.state.recipe)
    : model.deleteBookmark(model.state.recipe.id);
  */
  // 1 Add / Remove Bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2 Update recipe view
  recipeView.update(model.state.recipe);

  // 3 Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

// -------------------- CONTROLLER - DEV MENU --------------------- //

function controlDevLogin() {
  const userInputPass = prompt('What is the password?');
  model.devLogin(userInputPass);
}

async function controlDevMenu(btnClicked) {
  if (btnClicked === 'CLEAR RECIPES') {
    await model.clearMyRecipes();
  }

  // 02. Clear Bookmarks
  if (btnClicked === 'CLEAR BOOKMARKS') {
    model.clearBookmarks();
    bookmarksView.render(model.state.bookmarks);
    devMenuView.renderMessage('Bookmarks Cleared');
  }

  // 03. Reload Page / Reset Dev Menu to original state
  const indexURL = window.location.href.split('#')[0];
  location.replace(indexURL);
}

// ---------------------------------------------------------------- //
// ---------------------- CONTROLLER INIT() ----------------------- //
// ---------------------------------------------------------------- //

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);

  devMenuView.addHandlerDev(controlDevMenu);
  devLoginView.addHandlerDevLogin(controlDevLogin);
};

///////////////////////////////////////

init();
