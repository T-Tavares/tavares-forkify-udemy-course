import View from './View';

class DevMenuView extends View {
  _parentElement = document.querySelector('.dev__menu');
  _message = '';

  addHandlerDev(handler) {
    this._parentElement.addEventListener('click', e => {
      const btnClicked = e.target.innerHTML;
      handler(btnClicked);
    });
  }
}

export default new DevMenuView();
