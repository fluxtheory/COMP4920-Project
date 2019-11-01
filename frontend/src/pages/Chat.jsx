import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { PrivateChat } from '../components/PrivateChat';
import { useParams, Switch, Redirect, Route } from 'react-router-dom';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import { Chatkit } from '../App';

const useStyles = makeStyles({
  chatPage: {
    height: '100%',
    width: '100%',
  },
  spicyTrap: {
    objectFit: 'fill',
    height: '100%',
    width: '100%',
  },
});
const instanceLocator = 'v1:us1:4c1776d3-a51e-497e-8f3e-0a9f08eabf77';
const tokenProvider = new TokenProvider({
  url:
    'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/4c1776d3-a51e-497e-8f3e-0a9f08eabf77/token',
});
const IdentitySelect = ({ onSelect: handleSelect }) => {
  return (
    <div>
      <p>Who the hell are you?</p>
      <button onClick={handleSelect('jordan')}>Jordan</button>
      <button onClick={handleSelect('xavier')}>Xavier</button>
      <button onClick={handleSelect('aashwin')}>Aashwin</button>
    </div>
  );
};

const UserSelect = ({ identity }) => {
  const [selected, setSelected] = React.useState(null);

  const handleSelect = id => event => {
    event.preventDefault();
    setSelected(id);
  };

  return (
    <div>
      {selected ? <Redirect push to={`/chat/${identity}/${selected}`} /> : null}
      <p>Who would you like to chat with?</p>
      <button onClick={handleSelect('jordan')}>Jordan</button>
      <button onClick={handleSelect('xavier')}>Xavier</button>
      <button onClick={handleSelect('aashwin')}>Aashwin</button>
    </div>
  );
};

const PrivChat = () => {
  const { victim } = useParams();
  return (
    <div>
      <h2>Your Chat with {victim}</h2>
      <PrivateChat otherUserId={victim} />
    </div>
  );
};

const Chat = props => {
  const classes = useStyles();
  const { id } = useParams();
  const [identity, setIdentity] = React.useState(id || null);
  const chatkit = React.useContext(Chatkit);

  useEffect(() => {
    if (!id) return;
    setIdentity(id);
    const chatManager = new ChatManager({
      instanceLocator: instanceLocator,
      userId: id,
      tokenProvider,
    });

    chatManager
      .connect()
      .then(currentUser => {
        console.log('Successful connection', currentUser);
        chatkit.updateUser(currentUser);
      })
      .catch(err => {
        console.log('Error on connection', err);
      });
  }, [id]);

  const handleIdentitySelect = id => event => {
    event.preventDefault();
    setIdentity(id);
  };

  if (!identity) return <IdentitySelect onSelect={handleIdentitySelect} />;
  // NOTPROD
  // TODO: temporary, the chatkitprovider will be in App, but we need a way to
  // select a user before user accounts have been implmented
  return (
    <div>
      <UserSelect identity={identity} />
      <Route path="/chat/:identity/:victim" component={PrivChat} />
    </div>
  );
};

export { Chat };
