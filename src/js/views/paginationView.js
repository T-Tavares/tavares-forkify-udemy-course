import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // --------------------------- HANDLER ---------------------------- //
  // -------------------------- FUNCTIONS --------------------------- //

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  // ---------------------------- MARKUP ---------------------------- //
  // -------------------------- FUNCTIONS --------------------------- //

  _generateNextBtn(curPage) {
    return `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
  `;
  }

  _generatePrevBtn(curPage) {
    return `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
  `;
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const resultsPerPage = this._data.resultsPerPage;
    const resultsTotal = this._data.results.length;
    const numPages = Math.ceil(resultsTotal / resultsPerPage);

    // First page, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateNextBtn(curPage);
    }

    // Last page logic
    if (curPage === numPages && numPages > 1) {
      return this._generatePrevBtn(curPage);
    }

    // Other pages logic
    if (curPage < numPages) {
      return this._generatePrevBtn(curPage) + this._generateNextBtn(curPage);
    }
    // Single page logic
    return '';
  }
}

export default new PaginationView();
