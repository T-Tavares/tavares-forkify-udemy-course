import View from './View';
import ghostElView from './ghostElView';

class respMobileView extends View {
  // ---------------------- SELECTING ELEMENTS ---------------------- //

  // Container
  container = document.querySelector('.container');

  // Search and Recipe Sec
  searchSec = document.querySelector('.search-results');
  recipeSec = document.querySelector('.recipe');

  recipeSearchSwitch = this.container.querySelector('.recipe-list-switch');

  // Search Variables
  searchBar = document.querySelector('.search');
  searchInput = this.searchBar.children.item(0);
  searchBtn = this.searchBar.children.item(1);

  // -------------------- MOBILE CHECK FUNCTION --------------------- //
  /* 
    Several variables/Elements were set here to work in favour of the whole 
    mobile responsiviness without damaging or changing the old code from Jonas.

    Because of that we must keep the this.keyword (bounded) loyal to this file.
    
    In order to do that Callback functions called on ifMobile() must be arrow 
    functions inside this file respMobileView.js
  */

  ifMobile = function (callback) {
    if (window.innerWidth < 415) {
      callback();
    }
  };

  // --------------------- MOBILE SWITCH BUTTON --------------------- //
  // -------------------------- FUNCTIONS  -------------------------- //

  switchRecipeResults(visibleSec) {
    return () => {
      if (visibleSec === 'results') {
        this.hide(this.recipeSec);
        this.show(this.searchSec);
        this.hide(this.recipeSearchSwitch);
      } else if (visibleSec === 'recipe') {
        this.show(this.recipeSec);
        this.hide(this.searchSec);
        this.show(this.recipeSearchSwitch);
      } else
        throw new Error(
          '🧐 switchRecipeResults() only accepts "restuls" or "recipe" as input'
        );
    };
  }

  // ----------------------- SECTIONS STYLING ----------------------- //
  // -------------------------- FUNCTIONS  -------------------------- //

  searchSecStyle() {
    this.searchInput.placeholder = 'Search a recipe';
    this.searchBtn.children.item(1).innerHTML = '';
  }

  // ----------------- INIT() MOBILE RESPONSIVINESS ----------------- //

  initMobile = () => {
    // HIDE RECIPE AND RESULTS SECTIONS
    this.hide(this.recipeSec);
    this.hide(this.searchSec);

    // STYLE SEARCH SEC
    this.searchSecStyle();

    console.log('initMobile() executed');
  };

  // ---------------------------- MARKUP ---------------------------- //
  // -------------------------- FUNCTIONS --------------------------- //

  addHandlerRespMobile(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerSwitchSecMobile(handler) {
    this.recipeSearchSwitch.addEventListener('click', handler);
  }
}

export default new respMobileView();
