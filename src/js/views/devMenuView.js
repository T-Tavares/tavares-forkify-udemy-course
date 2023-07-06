import View from './View';

class DevMenuView extends View {
  _parentElement = document.querySelector('.dev__menu');
  _errorMessage = 'Wrong Password';
  _data;

  _generateMarkup() {
    if (this._data) {
      return `
        <ul class="dev__menu-list">
            <li>CLEAR RECIPES</li>
            <li>CLEAR BOOKMARKS</li>
        </ul>
        `;
    }
  }

  addHandlerDevMenu(handler) {
    this._parentElement.addEventListener('click', e => {
      handler(e.target.innerHTML);
    });
  }

  clearRecipesQuery() {
    return prompt('Type a QUERY for the recipes you want to DELETE.');
  }

  _devLog(data) {
    console.log(
      data.amount === 0
        ? 'No Recipes to be deleted on this query'
        : `${data.amount} ${
            data.amount > 1 ? 'Recipes where' : 'Recipe was'
          } Deleted.\n\nHere is a list with them:`
    );

    if (data.amount >= 1) {
      const devLogObj = { 'Recipe Name': 'Recipe ID' };

      data.titles.forEach((title, index) =>
        Object.assign(devLogObj, { [title]: data.id[index] })
      );

      console.table(devLogObj);
    }
  }
}

export default new DevMenuView();
