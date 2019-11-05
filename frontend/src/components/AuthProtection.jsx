import React from 'react';
import { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import { Chatkit } from '../App';
import { api } from '../utils';

const instanceLocator = 'v1:us1:4c1776d3-a51e-497e-8f3e-0a9f08eabf77';
const tokenProvider = new TokenProvider({
  url:
    'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/4c1776d3-a51e-497e-8f3e-0a9f08eabf77/token',
});

function AuthProtection({ children, ...rest }) {
  const chatkit = React.useContext(Chatkit);
  const [currState, setCurrState] = React.useState('initial');

  useEffect(() => {
    if (chatkit.user) {
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

        const { success, username } = data;
        if (!success) {
          localStorage.removeItem('userToken');
          return setCurrState('not-legit');
        }

        const chatManager = new ChatManager({
          instanceLocator: instanceLocator,
          userId: username,
          tokenProvider,
        });

        return chatManager
          .connect()
          .then(currentUser => {
            chatkit.updateUser(currentUser);
            setCurrState('legit');
          })
          .catch(err => {
            console.error('Boo boo on chatkit connection', err);
          });
      })
      .catch(err => {
        console.error('Boo boo when verifying token', err);
      });
  }, [chatkit]);

  switch (currState) {
    case 'initial':
      return (
        <div>
          <h1>Checking if you're legit.</h1>
        </div>
      );
    case 'not-legit':
      return <Redirect to="/login" />;
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
