import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Message } from './Message';
import { MessageInput } from './MessageInput';
import { useParams } from 'react-router-dom';
import { Session } from '../App';
import loadingCircle from '../img/circle128x128.gif';

const useStyles = makeStyles(theme => ({
  messages: {
    maxHeight: '55vh',
    overflow: 'auto',
  },
}));

const Messages = ({ messages }) =>
  !messages.length ? (
    <img
      style={{ position: 'absolute', left: '50%', right: '50%', top: '50%' }}
      src={loadingCircle}
      alt="Loading Messages..."
    />
  ) : (
    <ul>
      {messages.map(m => {
        return <Message key={m.id} msg={m} />;
      })}
    </ul>
  );

function PublicChat() {
  const classes = useStyles();
  const session = React.useContext(Session);
  const [chatMessages, setChatMessages] = React.useState([]);
  const [incomingMessage, setIncomingMessage] = React.useState(null);

  const roomId = useParams().course + '_public';

  React.useEffect(() => {
    if (!incomingMessage) return;
    setChatMessages([...chatMessages, incomingMessage]);
  }, [incomingMessage]);

  const handleOnMessage = message => {
    setIncomingMessage(message);
  };

  React.useEffect(() => {
    session.user
      .fetchMultipartMessages({ roomId })
      .then(messages => {
        setChatMessages([...messages]);
        return session.user.subscribeToRoomMultipart({
          roomId: roomId,
          hooks: {
            onMessage: handleOnMessage,
          },
          messageLimit: 0, // Don't fetch, and notify about, old messages
        });
      })
      .catch(err => {
        console.log(`Chatkit: Error fetching messages: ${err}`);
      })
      .then(magicObj => {
        console.info(`room subscription successful:`, magicObj);
      })
      .catch(err => {
        console.log(`Chatkit: Error fetching messages: ${err}`);
      });
  }, [roomId]);

  // fetch messages from all chat
  // subscribe to all chat
  // send message to all chat
  return (
    <div>
      <div className={classes.messages}>
        <Messages messages={chatMessages} />
      </div>
      <MessageInput roomId={roomId} />
    </div>
  );
}

export { PublicChat };
