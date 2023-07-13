import View from './View';

class DevLoginView extends View {
  _parentElement = document.querySelector('.nav__btn--dev');

  addHandlerDevLogin(handler) {
    this._parentElement.addEventListener('click', e => {
      if (e.target.closest('.logged')) return;
      if (e.target.closest('.nav__btn--dev')) handler();
    });
  }

  devLoginPrompt() {
    const userPass = prompt('Developer Password Required.');
    return userPass;
  }

  loggedInStyle() {
    this._parentElement.classList.toggle('logged');
  }

  _devLog() {
    console.log(`You're logged as a Dev`);
  }
}

export default new DevLoginView();
