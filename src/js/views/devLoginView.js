import View from './View';

class DevLoginView extends View {
  _parentElement = document.querySelector('.nav__btn-dev');

  addHandlerDevLogin(handler) {
    this._parentElement.addEventListener('click', e => {
      if (e.target.closest('.logged')) return;
      if (e.target.closest('.nav__btn-dev')) handler();
    });
  }

  loggedInStyle() {
    this._parentElement.classList.toggle('logged');
  }
}

export default new DevLoginView();
