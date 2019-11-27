import React, { useContext } from 'react';
import { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import { Session, CurrentUser } from '../App';
import { api } from '../utils';
import loadingCircle from '../img/circle128x128.gif';

const instanceLocator = 'v1:us1:8d540c79-80d9-4850-a367-72bce6dc16c5';
const tokenProvider = new TokenProvider({
  url:
    'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/4c1776d3-a51e-497e-8f3e-0a9f08eabf77/token',
});

function AuthProtection({ children, ...rest }) {
  const session = React.useContext(Session);
  const currUser = React.useContext(CurrentUser);
  const [currState, setCurrState] = React.useState('initial');

  useEffect(() => {
    if (session.user) {
      // user already logged in, no problemo
      return setCurrState('legit');
    }
    if (!localStorage.hasOwnProperty('userToken')) {
      return setCurrState('not-legit');
    }

    // send token to backend.
    api
      .get('/verify-token')
      .then(res => {
        const data = res.data;

        const { success, username, isAdmin } = data;
        currUser.updateCurrentUser({ username, admin: isAdmin });

        const chatManager = new ChatManager({
          instanceLocator: instanceLocator,
          userId: username,
          tokenProvider,
        });

        return chatManager
          .connect()
          .then(currentUser => {
            session.updateUser(currentUser);
            setCurrState('legit');
          })
          .catch(err => {
            console.error('Boo boo on chatkit connection', err);
          });
      })
      .catch(err => {
        if (err.response && err.response.data) {
          const { success } = err.response.data;
          if (!success) {
            localStorage.removeItem('userToken');
            return setCurrState('not-legit');
          }
        }
        console.error('Boo boo when verifying token', err);
      });
  }, [session]);

  switch (currState) {
    case 'initial':
      return (
        <div>
          <img
            style={{
              position: 'absolute',
              left: '0',
              right: '0',
              top: '0',
              bottom: '0',
              margin: 'auto',
            }}
            src={loadingCircle}
            alt="Loading Messages..."
          />
        </div>
      );
    case 'not-legit':
      return (
        <Redirect
          to={{
            pathname: '/login',
            state: { sneakyBastard: true },
          }}
        />
      );
    case 'legit':
      // cloning so we can pass props to the child components
      return (
        <React.Fragment>{React.cloneElement(children, rest)}</React.Fragment>
      );
    default:
      return (
        <div>
          <h1>AuthProtection: We shouldn't ever be seeing this</h1>
        </div>
      );
  }
}

export { AuthProtection };
