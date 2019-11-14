import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core/';
import { api } from '../utils';
import { Autocomplete } from '@material-ui/lab/';
import { Typography, Box } from '@material-ui/core';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import { useRouteMatch, Link } from 'react-router-dom';
import { Session } from '../App';

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
    try {
      let ret = [];
      for (let i = 0; i < 5 || i >= session.user.rooms.length; i++) {
        let nextRoom = session.user.rooms[i];
        let id_split = nextRoom.id.split('_');
        let otherUser = '';
        if (id_split[0] !== 'DM') continue;
        if (id_split[1] === session.user.id) otherUser = id_split[2];
        else otherUser = id_split[1];
        ret.push(otherUser);
      }
      resolve(ret);
    } catch (err) {
      console.log(err);
      reject([]);
    }
  });
};

function ActiveChats(props) {
  const classes = useStyles();

  const { params } = useRouteMatch('/kudo/:course');
  const course = params.course;
  const session = React.useContext(Session);
  const [activeChats, setActiveChats] = React.useState([]);

  React.useEffect(() => {
    const prom = getLastFiveChats(session).then(resp => {
      setActiveChats(resp);
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
        {activeChats.map(u => {
          return (
            <Button
              classes={{ root: classes.userButton }}
              key={u}
              component={Link}
              to={'/kudo/' + u + '/dm'}
            >
              <ChildCareIcon />
              <Box mx={1}>{u}</Box>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export { ActiveChats };
