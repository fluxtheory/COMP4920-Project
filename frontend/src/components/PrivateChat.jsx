import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Session } from '../App';
import { Message } from '../components/Message';
import { MessageInput } from '../components/MessageInput';
import { useParams } from 'react-router-dom';

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
        return <Message key={m.id} msg={m} />;
      })}
    </ul>
  );

const PrivateChat = () => {
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const session = React.useContext(Session);
  const [roomId, setRoomId] = React.useState(null);
  const otherUserId = useParams().user;
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
          console.log(`Created room called ${room.name} (id ${room.id})`);
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
      <MessageInput roomId={roomId} />
    </div>
  );
};

export { PrivateChat };
