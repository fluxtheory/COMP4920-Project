import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Chatkit } from '../App';
import { Message } from './Message';
import { MessageInput } from './MessageInput';
// import { useParams } from 'react-router-dom';
// userParam();
import { Session } from '../App';

const useStyles = makeStyles(theme => ({}));

const Messages = ({ messages }) =>
  !messages.length ? (
    'Loading messages'
  ) : (
    <ul>
      {messages.map(m => {
        return <Message key={m.id} msg={m} />;
      })}
    </ul>
  );

function PublicChat(props) {
  const classes = useStyles();
  const session = React.useContext(Session);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = React.useState([]);
  const [incomingMessage, setIncomingMessage] = React.useState(null);

  const roomId = props.forCourse + '_public';

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
    <div className={classes.yourClassname}>
      <Messages messages={chatMessages} />
      <MessageInput roomId={roomId} />
    </div>
  );
}

export { PublicChat };
