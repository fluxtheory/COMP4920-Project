import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core/';
import { api } from '../utils';
import { Autocomplete } from '@material-ui/lab/';
import { Typography, Box } from '@material-ui/core';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import { useRouteMatch, Link } from 'react-router-dom';
import { Session } from '../App';
import ChatBubbleTwoToneIcon from '@material-ui/icons/ChatBubbleTwoTone';

const useStyles = makeStyles(theme => ({
  courseUsersChatContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },

  userListContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: '0.2rem',
  },

  userButton: {
    justifyContent: 'start',
  },
}));

const getLastFiveChats = function(session) {
  return new Promise((resolve, reject) => {
    // note: rooms are provided in descending order of the last message sent
    // get room
    // identify DM_ in id
    // get user id of other user whom isnt the current session holder
    try {
      let active = [];
      let inactive = [];
      for (let i = 0; i < 5 && i < session.user.rooms.length; i++) {
        let nextRoom = session.user.rooms[i];

        let id_split = nextRoom.id.split('_');
        if (id_split[0] !== 'DM') continue;

        // need to subscribe to see the users
        session.user
          .subscribeToRoomMultipart({
            roomId: nextRoom.id,
            hooks: {
              onMessage: () => {},
            },
            messageLimit: 0, // Don't fetch, and notify about, old messages
          })
          .then(() => {
            let otherUser = '';
            // you can DM yourself as a clipboard of sorts. We dont want that in active chats
            if (nextRoom.users.length < 2) return;
            if (nextRoom.users[0].id === session.user.id)
              otherUser = nextRoom.users[1].id;
            else otherUser = nextRoom.users[0].id;
            if (nextRoom.lastMessageAt) {
              if (
                Date.now() - Date.parse(nextRoom.lastMessageAt) <
                7 * 24 * 60 * 60 * 1000
              )
                // one week's worth of milliseconds
                active.push(otherUser);
              else inactive.push(otherUser);
            }
          });
      }
      resolve({ active: active, inactive: inactive });
    } catch (err) {
      console.log(err);
      reject({ active: [], inactive: [] });
    }
  });
};

function ActiveChats(props) {
  const classes = useStyles();

  const { params } = useRouteMatch('/kudo/:course');
  const course = params.course;
  const session = React.useContext(Session);
  const [activeChats, setActiveChats] = React.useState([]);
  const [inactiveChats, setInactiveChats] = React.useState([]);

  React.useEffect(() => {
    const prom = getLastFiveChats(session).then(resp => {
      setActiveChats(resp['active']);
      setInactiveChats(resp['inactive']);
    });
  }, []);
  const [userInput, setUserInput] = React.useState('');

  const handleSubmit = e => {
    e.preventDefault();
  };

  const handleChange = (event, value) => {
    if (!value) return setUserInput('');
    setUserInput(value);
  };

  return (
    <div className={classes.courseUsersChatContainer}>
      <div className={classes.userListContainer}>
        <p> Past week:</p>
        {activeChats.map(u => {
          return (
            <Button
              classes={{ root: classes.userButton }}
              key={u}
              component={Link}
              to={'/kudo/' + u + '/dm'}
            >
              <ChatBubbleTwoToneIcon />
              <Box mx={1}>{u}</Box>
            </Button>
          );
        })}
        <p>Later than a week:</p>
        {inactiveChats.map(u => {
          return (
            <Button
              classes={{ root: classes.userButton }}
              key={u}
              component={Link}
              to={'/kudo/' + u + '/dm'}
            >
              <ChatBubbleTwoToneIcon />
              <Box mx={1}>{u}</Box>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export { ActiveChats };
