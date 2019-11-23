import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Message } from './Message';
import { MessageInput } from './MessageInput';
import { useParams } from 'react-router-dom';
import { Session } from '../App';
import loadingCircle from '../img/circle128x128.gif';
import { Box } from '@material-ui/core';
import { Scrollbars } from 'react-custom-scrollbars';

const useStyles = makeStyles(theme => ({
  messages: {},
}));

const Messages = ({ messages }) => {
  if (!messages.length) {
    return (
      <img
        style={{ position: 'absolute', left: '50%', right: '50%', top: '50%' }}
        src={loadingCircle}
        alt="Loading Messages..."
      />
    );
  }
  return (
    <div>
      {messages.map(m => {
        return <Message key={m.id} msg={m} />;
      })}
    </div>
  );
};

function PublicChat() {
  const classes = useStyles();
  const session = React.useContext(Session);
  const [chatMessages, setChatMessages] = React.useState([]);
  const [pendingMessage, setPendingMessage] = React.useState([]);
  const [incomingMessage, setIncomingMessage] = React.useState(null);
  const ref = React.createRef();

  const roomId = useParams().course + '_public';

  React.useEffect(() => {
    if (!incomingMessage) return;
    setChatMessages([...chatMessages, incomingMessage]);
  }, [incomingMessage]);

  React.useEffect(() => {
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [chatMessages]);

  const handleOnMessage = message => {
    setIncomingMessage(message);
    setPendingMessage([]);
  };

  const handleMessageSend = message => {
    setPendingMessage([message]);
  };

  React.useEffect(() => {
    session.user
      .fetchMultipartMessages({ roomId })
      .then(messages => {
        setChatMessages([...messages, ...pendingMessage]);
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

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Scrollbars autoHide>
        <Messages messages={chatMessages} />
        <Box ref={ref} height={0} width={0} />
      </Scrollbars>
      <MessageInput roomId={roomId} onMessageSend={handleMessageSend} />
    </Box>
  );
}

export { PublicChat };
