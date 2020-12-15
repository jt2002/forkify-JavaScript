import View from './View.js';
import previewView from './previewView.js';

// import icons from '../img/icons.svg'; // Parcel 1
import icons from 'url:../../img/icons.svg'; // Parcel 2

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet.  Find a nice recipe and bookmark it';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    //   Use map() to loop & extract each object and put it in html
    //   Then, join all html's and add to the DOM
    return this._data
      .map(bookmark => previewView.render(bookmark, false)) // false = get html, not rendered
      .join('');
  }
}

export default new BookmarksView();
