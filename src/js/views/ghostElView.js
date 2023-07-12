import View from './View.js';

class GhostElView extends View {
  _container = document.querySelector('.container');

  getGhostElement() {
    this._container.addEventListener('click', e => {
      console.log(e.target);
    });
  }
}

export default new GhostElView();
