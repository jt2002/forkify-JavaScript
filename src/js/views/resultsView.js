import View from './View.js';
import previewView from './previewView.js';

// import icons from '../img/icons.svg'; // Parcel 1
import icons from 'url:../../img/icons.svg'; // Parcel 2

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query! Please try again';
  _message = '';

  _generateMarkup() {
    //   Use map() to loop & extract each object and put it in html
    //   Then, join all html's and add to the DOM
    return this._data
      .map(result => previewView.render(result, false)) // false = get html, not rendered
      .join('');
  }
}

export default new ResultsView();
