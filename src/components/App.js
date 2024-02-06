import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { React, useState } from 'react';
//  variables
//  variables
import { getNews } from '../utils/NewsApi';

//  components

import Header from './Header';
import Footer from './Footer';
import AboutAuthor from './AboutAuthor';
import PopupRegister from './PopupRegister';
import PopupSuccess from './PopupSuccess';
import Navbar from './Navbar';
import SavedNews from './SavedNews';
import SearchResults from './SearchResults';
import ProtectedRoute from './ProtectedRoute';

//  context
import { CurrentUserContext } from '../contexts/CurrentUserContext';
//css
import '../blocks/App.css';
import PopupSignIn from './PopupSignIn';

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [activeModal, setActiveModal] = useState('');
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startSearch, setStartSearch] = useState(false);

  const closePopup = () => {
    setActiveModal('');
  };

  const openPopupRegister = () => {
    setActiveModal('register');
  };

  const openPopupSignIn = () => {
    setActiveModal('signin');
  };

  const openPopupSuccess = () => {
    setActiveModal('success');
  };

  const handleSignUp = (data) => {
    console.log('sign up', data);
    openPopupSuccess();
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  const handleSignIn = (data) => {
    console.log('sign in', data);
    setCurrentUser(data);
    setLoggedIn(true);
    closePopup();
  };

  const handleNewsMark = (isMarked) => {
    console.log('click');
  };

  const handleSearch = (data) => {
    setStartSearch(true);
    setIsLoading(true);
    getNews(data)
      .then((res) => {
        setNews(res.articles);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  return (
    <div className="App">
      <CurrentUserContext.Provider
        value={{
          currentUser,
          isLoggedIn,
        }}
      >
        <BrowserRouter>
          <Navbar openPopupRegister={openPopupRegister} handleLogout={handleLogout} activeModal={activeModal} />

          <Switch>
            <ProtectedRoute isLoggedIn={isLoggedIn} path="/saved-news">
              <SavedNews handleNewsMark={handleNewsMark} news={news} />
            </ProtectedRoute>
            <Route exact path="/">
              <Header handleSearch={handleSearch} />

              {startSearch && <SearchResults handleNewsMark={handleNewsMark} news={news} isLoading={isLoading} />}
              <AboutAuthor />
            </Route>
          </Switch>
          <Footer />
        </BrowserRouter>
        {activeModal === 'success' && (
          <PopupSuccess handleClosePopup={closePopup} isOpen={activeModal === 'success'} openPopupSignIn={openPopupSignIn} />
        )}
        {activeModal === 'register' && (
          <PopupRegister
            handleClosePopup={closePopup}
            isOpen={activeModal === 'register'}
            onSubmit={handleSignUp}
            openPopupSignIn={openPopupSignIn}
          />
        )}
        {activeModal === 'signin' && (
          <PopupSignIn
            handleClosePopup={closePopup}
            isOpen={activeModal === 'signin'}
            onSubmit={handleSignIn}
            openPopupRegister={openPopupRegister}
          />
        )}
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
