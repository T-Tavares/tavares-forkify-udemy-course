// MODEL IMPORT
import * as model from './model.js';

// CONFIG IMPORT
import { MODAL_CLOSE_SEC, RECIPES_NUM_OPENING } from './config.js';

// VIEWS IMPORTS
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import devLoginView from './views/devLoginView.js';
import devMenuView from './views/devMenuView.js';

import respMobileView from './views/respMobileView.js';

import openingView from './views/openingView.js';

// OTHER IMPORTS
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

    // MOBILE RESPONSIVINESS - Show Recipe / Hide Results
    respMobileView.ifMobile(respMobileView.switchRecipeResults('recipe'));
    respMobileView.menuClose();
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

    // MOBILE RESPONSIVINESS - Hide Recipe / Show Results
    respMobileView.ifMobile(respMobileView.switchRecipeResults('results'));
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

  // 4 Render Mobile Bookmarks When bookmark is added or took out
  respMobileView.renderBookmarksMobile(model.state.bookmarks);
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

function controlRenderBookmarksMobile() {
  respMobileView.renderBookmarksMobile(model.state.bookmarks);
}

// -------------------- CONTROLLER - DEV MENU --------------------- //
// -------------------------- FUNCTIONS --------------------------- //

function controlDevLogin() {
  try {
    // 1. Request dev password and check if its correct
    model.devLoginCheck(devLoginView.devLoginPrompt());

    if (model.state.devLogged) {
      // 2. Change icon color to Green
      devLoginView.loggedInStyle();
      // 3. Render Dev Menu
      devMenuView.render(model.state.devLogged);
    }
  } catch (err) {
    console.error('🧐', err.message);
  }
}

async function controlDevMenu(btnClicked) {
  if (btnClicked === 'CLEAR RECIPES') {
    await model.clearMyRecipes(devMenuView.clearRecipesQuery());
    bookmarksView.render();
    resultsView._clear();
    recipeView._clear();
    devMenuView._clearHash();
    devMenuView._devLog(model.state.clearedRecipes);
  }

  // 02. Clear Bookmarks
  if (btnClicked === 'CLEAR BOOKMARKS') {
    model.clearBookmarks();
  }
}

// --------------------- CONTROLLER - MOBILE ---------------------- //
// -------------------------- FUNCTIONS --------------------------- //

function controlRespMobile() {
  /*
  The Callback function is not called here because of the nature and 
  logic of the ifMobile() and all the mobile responsiviness adjustments
  */
  respMobileView.ifMobile(respMobileView.initMobile);
}

async function controlSwitchMobileSec() {
  // check if search results is an empty element
  if (respMobileView.searchResults.innerHTML.trim() === '') {
    // if yes, clear recipe el
    respMobileView.recipeSec.innerHTML = '';

    // fetch and render mobile opening msg and recipes
    const recipesArr = await model.fetchRandomRecipesArr(RECIPES_NUM_OPENING);
    respMobileView.openingRecipeSecStyle(recipesArr);

    // if not, switch back to results
  } else {
    respMobileView.ifMobile(respMobileView.switchRecipeResults('results'));
  }

  // Getting rid of hash WITHOUT reload page if search has some results
  window.history.pushState(
    '',
    document.title,
    window.location.href.split('#')[0]
  );
}

function controlMenuMobile(btnClicked) {
  respMobileView.menuOpenFocus(btnClicked);
}

// ---------------------------------------------------------------- //

async function controlOpening() {
  const recipesArr = await model.fetchRandomRecipesArr(RECIPES_NUM_OPENING);
  openingView.openingMsgAndRecipes(recipesArr);
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

  devLoginView.addHandlerDevLogin(controlDevLogin);
  devMenuView.addHandlerDevMenu(controlDevMenu);

  respMobileView.addHandlerRespMobile(controlRespMobile);
  respMobileView.addHandlerSwitchSecMobile(controlSwitchMobileSec);
  respMobileView.addHandlerRenderBookmarksMobile(controlRenderBookmarksMobile);
  respMobileView.addHandlerMenuMobile(controlMenuMobile);

  openingView.addHandlerOpening(controlOpening);
};

///////////////////////////////////////

init();
