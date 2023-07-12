import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  // _backtoListBtn = document.querySelector('.recipe-list-switch-btn');
  _errorMessage = 'No recipes found for your query. Please try again.';
  _message = '';

  // ---------------------------- MARKUP ---------------------------- //
  // -------------------------- FUNCTIONS --------------------------- //

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }

  hide(el = this._parentElement) {
    el.parentElement.classList.add('hidden-off');
  }
  show(el = this._parentElement) {
    el.parentElement.classList.remove('hidden-off');
  }
}

export default new ResultsView();
