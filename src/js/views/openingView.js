import View from './View';
import previewView from './previewView';

class OpeningView extends View {
  recipeSec = document.querySelector('.recipe');

  openingMsgAndRecipes(recipesArr) {
    const openingMsgMarkup = `
          <div class="mobile-welcome">
            <h1>👆 Start Searching for a Dish or Ingredient on the search bar above </h1>
            <h1> Or go straight to one of our delicious recipes below 👇</h1>
          </div>
        `;

    const openingRecipesMarkup = `
        <ul>
          ${recipesArr
            .map(recipe => previewView.render(recipe, false))
            .join('')}
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

  addHandlerOpening(handler) {
    window.addEventListener('load', () => {
      if (window.location.hash) return;
      handler();
    });
  }
}
export default new OpeningView();
