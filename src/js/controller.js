import * as model from './model';
import RecipeView from './views/recipeView.js';
// import '/core-js/stable';
import '/core-js/core';
import './regenerator-runtime/runtime';
import searchView from './views/searchView';
import ResultView from './views/resultView';
import bookmarkView from './views/bookmarkView';
import paginationView from './views/paginationView';
import resultView from './views/resultView';
import recipeView from './views/recipeView.js';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SECONDS } from './config';

// https://forkify-api.herokuapp.com/v2
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;

    RecipeView.renderSpinner();

    //resuls view to mark selected result view

    resultView.update(model.getSearchResultPage());

    //loading recipe
    await model.loadRecipe(id);
    RecipeView.render(model.state.recipe);

    bookmarkView.update(model.state.bookmarks);
    // if (!data.ok) throw new error(data.message);
  } catch (err) {
    RecipeView.renderError();
  }

  //Render recipe
};

const controlSearchResults = async function () {
  try {
    ResultView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);

    // Render results
    ResultView.render(model.getSearchResultPage());
    // REnder pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // console.log(goToPage);
  // Render new results
  ResultView.render(model.getSearchResultPage(goToPage));
  // REnder new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings in the state
  model.updateServings(newServings);
  RecipeView.update(model.state.recipe);

  //update the recipe view
};

const controlAddBookMark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.removeBookmark(model.state.recipe.id);
  }
  // console.log(model.state.recipe);
  recipeView.update(model.state.recipe);
  // render bookmarks
  bookmarkView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    //render new added recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderSuccessMessage();

    //render again

    bookmarkView.render(model.state.bookmarks);

    //change ID in the URL

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerREnder(controlBookmarks);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);

  // controlServings();
};
init();
// window.addEventListener('hashchange', urlData);
// const clearbookmarks = function () { only used for dev purposes
// localStorage.clear('bookmarks');
// };
