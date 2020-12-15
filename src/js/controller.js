import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // Polyfill everything
import 'regenerator-runtime/runtime'; // Polyfill async

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// Parcel maintains the state
// When updating the code, the state will not be reset (for stater page)
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    // Take the ID from the 1st character on (#5ed6604591c37cdc054bc89a)
    const id = window.location.hash.slice(1);
    // console.log(id);

    // When visiting the page and no ID selected
    if (!id) return;
    recipeView.renderSpinner();

    // 1 - Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 2 - Updating bookmarks view
    // Debugger!
    // debugger;
    bookmarksView.update(model.state.bookmarks);

    // 3 - Loading recipe is an async function and will return a Promise
    //       so we have to await before moving on to the next step
    //     This is one async funtion calling another async function
    // loadRecipe() does not return anything
    await model.loadRecipe(id);
    // console.log(model.state.bookmarks);

    // 4 - Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1 - Get search query
    const query = searchView.getQuery();

    // 2 - Load search results
    //   model.loadSearchResults() does not return anything; Just manipulate the state variable
    await model.loadSearchResults(query);

    // 3 - Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4 - Render initial pagination button on the bottom
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1 - Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2 - Update recipe view; See the bookmark filled/darken
  recipeView.update(model.state.recipe);

  // 3 - Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
  // console.log(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // console.log(newRecipe); // ingredient: "0.5, Rice"
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL (state, title, ID)
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // E.g. window.history.back() to go bak to late page

    // Close the form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

// Subscriber of Publisher-Subscriber Pattern
const init = function () {
  // addEventListener should be attached to DOM elements that already exist
  //   when page is rendered, NOT the one dynamically created by JS
  //   (it is not possible to addEventListener to elements that do not exist)
  //   (Add addEventListener to parent element and use Event Delegation)
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome');
};

init();

// controlRecipes();

// 6 - Listening For load and hashchange Events
//   Set href="#123....." in <a> of index.html and listen for hashchange event
//     and run controlRecipes()
//   Also, listen for load, in case copy URL to another window

// ['hashchange', 'load'].forEach(ev =>
//   window.addEventListener(ev, controlRecipes)
// );
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
