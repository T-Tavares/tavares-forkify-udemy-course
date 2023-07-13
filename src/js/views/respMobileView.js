import View from './View';
import previewView from './previewView.js';

class respMobileView extends View {
  // ---------------------- SELECTING ELEMENTS ---------------------- //

  // Container
  container = document.querySelector('.container');

  // Nav
  nav = document.querySelector('.nav');
  navOverlay = document.querySelector('.nav__overlay');

  // Search Sec
  searchSec = document.querySelector('.search-results');
  searchResults = document.querySelector('.results');
  searchBar = document.querySelector('.search');
  searchInput = this.searchBar.children.item(0);
  searchBtn = this.searchBar.children.item(1);

  // Recipe Sec
  recipeSec = document.querySelector('.recipe');
  recipeSearchSwitch = this.container.querySelector('.recipe-list-switch');
  addRecipeBtn = document.querySelector('.nav__btn--add-recipe');

  // Bookmarks Sec
  bookmarksBtn = document.querySelector('.nav__btn--bookmarks');
  bookmarksSec = document.querySelector('.bookmarks');
  bookmarksMoblieSec = document.querySelector('.bookmarks-mobile');

  // Dev Sec
  devBtn = document.querySelector('.nav__btn--dev');
  devSec = document.querySelector('.dev__menu');

  // Search Variables

  constructor() {
    super();
    this._addHandlerCloseMenuMobile();
  }
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

  // BOOKMARKS SECTION
  /*
  I'm not reusing the Render method here because I'd have to break the mobile
  section into diferent files /per section to make the _parentElement and all 
  the inherited Methods from View.js valid.

  For the sake of simplicity and as an exercise I've decided to rebuild the 
  same logic as the View.render() method.

  Also aligning with my idea of try to not change at all or minimum changes on
  Jonas code.

  */
  renderBookmarksMobile = data => {
    // generate markup

    const markup = data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');

    // clear element to insert markup
    this.bookmarksMoblieSec.innerHTML = '';

    //  add markup
    this.bookmarksMoblieSec.insertAdjacentHTML('afterbegin', markup);
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
          '🧐 switchRecipeResults() only accepts "results" or "recipe" as input'
        );
    };
  }

  // ----------------------- SECTIONS STYLING ----------------------- //
  // -------------------------- FUNCTIONS  -------------------------- //

  openingRecipeSecStyle(recipesArr) {
    const openingMsgMarkup = `
      <div class="mobile-welcome">
        <h1>Start Searching for a Dish or Ingredient</h1>
        <h1>Or go straight to one of our most viewed recipes below</h1>
      </div>
    `;

    const openingRecipesMarkup = `
    <ul>
      ${recipesArr.map(recipe => previewView.render(recipe, false)).join('')}
    </ul>
    `;

    const jonasMarkup = `
    <p class="copyright copyright_mobile">
      &copy; Copyright by
      <a
        class="twitter-link"
        target="_blank"
        href="https://twitter.com/jonasschmedtman"
        >Jonas Schmedtmann</a>
        . Use for learning or your portfolio. Don't use to teach. Don't claim as your own.
    </p>
    `;

    this.recipeSec.insertAdjacentHTML('afterbegin', jonasMarkup);
    this.recipeSec.insertAdjacentHTML('afterbegin', openingRecipesMarkup);
    this.recipeSec.insertAdjacentHTML('afterbegin', openingMsgMarkup);
  }

  navSecStyle() {
    this.addRecipeBtn.closest('.nav__item').classList.add('hidden-off');
  }

  searchSecStyle() {
    this.searchInput.placeholder = 'Search a recipe';
    this.searchBtn.children.item(1).innerHTML = '';
  }

  devSecStyle() {
    this.devSec.classList.add('dev__menu__mobile');
    this.hide(this.devSec);
  }

  // ---------------------------------------------------------------------- //
  menuOpenFocus(btnClicked) {
    // if (btnClicked === 'nav__btn--dev') {
    if (btnClicked === 'logged') {
      this.devSec.classList.remove('hidden-off');
      this.navOverlay.classList.remove('hidden-off');
    }
    if (btnClicked === 'nav__btn--bookmarks') {
      this.bookmarksMoblieSec.classList.remove('hidden-off');
      this.navOverlay.classList.remove('hidden-off');
    }
  }

  menuClose() {
    [this.navOverlay, this.bookmarksMoblieSec, this.devSec].forEach(sec => {
      sec.classList.add('hidden-off');
    });
  }

  // ----------------- INIT() MOBILE RESPONSIVINESS ----------------- //

  initMobile = () => {
    // HIDE RECIPE AND RESULTS SECTIONS
    // this.hide(this.recipeSec);
    this.hide(this.searchSec);

    // STYLE SECS
    this.navSecStyle();
    this.searchSecStyle();
    this.devSecStyle();
  };

  // --------------------------- HANDLER ---------------------------- //
  // -------------------------- FUNCTIONS --------------------------- //

  addHandlerRespMobile(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerSwitchSecMobile(handler) {
    this.recipeSearchSwitch.addEventListener('click', handler);
  }

  addHandlerRenderBookmarksMobile(handler) {
    console.log('mobile bookmarks handler working');
    handler();
  }

  addHandlerMenuMobile(handler) {
    this.nav.addEventListener('click', e => {
      const btnClicked = [...e.target.closest('button').classList]
        .slice(-1)
        .toString();
      handler(btnClicked);
    });
  }

  _addHandlerCloseMenuMobile() {
    this.navOverlay.addEventListener('click', this.menuClose.bind(this));
  }

  addHandlerOpeningMobile(handler) {
    if (window.location.hash) return;
    this.ifMobile(handler);
  }
}

export default new respMobileView();
