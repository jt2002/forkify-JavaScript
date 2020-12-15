import View from './View.js';

// import icons from '../img/icons.svg'; // Parcel 1
import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // Publisher of Publisher-Subscriber Pattern
  addHandlerClick(handler) {
    // 1. Use Event Delegation
    //   Add event listener to the parent
    //   Then, get the closest of e.target (the element that triggered event)
    //   The closest is the left- of right-button we are looking for
    // Note: MUST listen to the click event on parent (not the button) because the user
    //   may click on the icon and not on the button
    // 2. Use custom Data Attribute (data-goto) to tell JavaScript which page to go to
    //   Establish the connection between the DOM and JavaScript code
    // Note: This is the reason to get the button since 'data-goto' is on the button,
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto; // Convert from String to Number
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
        <button class="btn--inline pagination__btn--next" data-goto=${
          curPage + 1
        }>
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>      
      `;
    }
    // Last page
    if (curPage === numPages && numPages > 1) {
      return `
        <button class="btn--inline pagination__btn--prev" data-goto=${
          curPage - 1
        }>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>      
      `;
    }
    // Other page
    if (curPage < numPages) {
      return `
        <button class="btn--inline pagination__btn--prev" data-goto=${
          curPage - 1
        }>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>      
        <button class="btn--inline pagination__btn--next" data-goto=${
          curPage + 1
        }>
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>      
      `;
    }
    // Page 1, but no other pages
    return '';
  }
}

export default new PaginationView();
