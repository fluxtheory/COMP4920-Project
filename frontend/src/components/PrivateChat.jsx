import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Session } from '../App';

const useStyles = makeStyles({
  yourClassname: {
    color: 'blue',
  },
});

const Messages = ({ messages }) =>
  !messages.length ? (
    'Loading messages'
  ) : (
    <ul>
      {messages.map(m => {
        return <li key={m.id}>{m.parts[0].payload.content}</li>;
      })}
    </ul>
  );

const PrivateChat = ({ otherUserId }) => {
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const session = React.useContext(Session);
  const [roomId, setRoomId] = React.useState(null);
  const [chatMessages, setChatMessages] = React.useState([]);
  const [incomingMessage, setIncomingMessage] = React.useState(null);

  React.useEffect(() => {
    if (!incomingMessage) return;
    setChatMessages([...chatMessages, incomingMessage]);
  }, [incomingMessage]);

  React.useEffect(() => {
    if (!session.user) return;
    console.log(session.user.id);
    let users = [session.user.id, otherUserId];
    users.sort();

    let roomName = 'DM_' + users[0] + '_' + users[1];

    let roomExists = false;

    session.user.rooms.forEach(room => {
      if (room.id === roomName) {
        roomExists = true;
      }
    });

    if (!roomExists) {
      session.user
        .createRoom({
          id: roomName,
          name: users[0] + ' and ' + users[1],
          private: true,
          addUserIds: [users[0], users[1]],
          customData: {},
        })
        .then(room => {
          console.log(`Created room called ${room.name}`);
        })
        .catch(err => {
          console.log(`Error creating room ${err}`);
        });
    }

    setRoomId(roomName);
  }, [session]);

  const handleOnMessage = message => {
    setIncomingMessage(message);
  };

  React.useEffect(() => {
    if (!roomId) return;
    // subscription to room enables persistent connection
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

  const handleChange = event => {
    setMessage(event.target.value);
  };
  const handleClick = async event => {
    try {
      setMessage('');
      await session.user.sendSimpleMessage({
        text: message,
        userId: otherUserId,
        roomId: roomId,
      });
    } catch (err) {
      throw Error(`Sending message via Chatkit fucked up: ${err}`);
    } finally {
    }
  };

  return (
    <div className={classes.yourClassname}>
      <Messages messages={chatMessages} />
      <input type="text" onChange={handleChange} value={message} />
      <button onClick={handleClick}>Send a message!</button>
    </div>
  );
};

export { PrivateChat };
