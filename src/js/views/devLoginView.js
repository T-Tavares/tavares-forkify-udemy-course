import View from './View';

class DevLoginView extends View {
  _parentElement = document.querySelector('.dev__login');
  _message = '';

  addHandlerDevLogin(handler) {
    this._parentElement.addEventListener('click', e => handler(handler));
  }

  _generateMarkup() {
    return `
    <ul class="dev__menu-list">
      <li>CLEAR RECIPES</li>
      <li>CLEAR BOOKMARKS</li>
    </ul>
    `;
  }
}

export default new DevLoginView();
