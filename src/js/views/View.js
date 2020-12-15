// Parent class of all render views
// import icons from '../img/icons.svg'; // Parcel 1
import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {Boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns { undefined | string } A markup string is returned if render=false
   * @this {Object} View instance
   * @author Joe T
   * @todo Finish implementation
   */
  render(data, render = true) {
    // It is possible that data is empty or an empty array
    // !data works only for null or undefined
    // Also check for an empty array
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // No need to check data existence since it must have already been data
    // Otherwise, left-pane throws error because update with non-existence data on 1st load
    // if (!data || (Array.isArray(data) && data.length === 0)) {
    //   return this.renderError();
    // }

    this._data = data;
    // Get newMarkup to compare with old markup on the page
    //   and update only the change
    const newMarkup = this._generateMarkup();

    // Trick: Convert markup strings to virtual DOM objects (living only in memory)
    //   so that we can compare with old markup on the page
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // Convert NodeList to Array
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // Loop 2 arrays at the same time
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Node.nodeValue - If Node is Text, get the content of Text node
      //                - Otherwise, most of them are null
      // Focus only the firstChild since it's the Text node with value
      //   e.g. <div class=​"recipe__quantity">​1 1/4​</div>​
      // Get only the non-empty string, and update the curEl
      // Also, use optional chaining '?' since firstChild may not exist
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('nV', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Also, update attributes, e.g. Data Attributes, class
      if (!newEl.isEqualNode(curEl)) {
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Default message is this._errorMessage
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>    
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>    
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
