import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { PrivateChat } from '../components/PrivateChat';
import { useParams, Switch, Redirect, Route } from 'react-router-dom';
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
