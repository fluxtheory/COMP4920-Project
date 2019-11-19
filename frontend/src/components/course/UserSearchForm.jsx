import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core/';
import { api } from '../../utils';
import { Autocomplete } from '@material-ui/lab/';
import { Typography, Box } from '@material-ui/core';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import { useRouteMatch, Link } from 'react-router-dom';
import { Session } from '../../App';

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

const getAllUsers = function(course) {
  return new Promise((resolve, reject) => {
    api
      .get('/' + course + '/users')
      .then(resp => {
        console.log(resp.data);
        resolve(resp.data);
      })
      .catch(err => {
        console.log(err);
        reject([]);
      });
  });
};

function UserSearchForm(props) {
  const classes = useStyles();

  const { params } = useRouteMatch('/kudo/:course');
  const session = React.useContext(Session);
  const course = params.course;
  const [users, setUsers] = React.useState([]);
  const [userSearch, setUserSearch] = React.useState([]);

  React.useEffect(() => {
    const prom = getAllUsers(course).then(resp => {
      setUsers(resp);
      setUserSearch(resp);
    });
  }, [course]);
  const [userInput, setUserInput] = React.useState('');

  const handleSubmit = e => {
    e.preventDefault();
  };

  const handleChange = event => {
    if (!event.target.value) {
      setUserInput('');
      setUserSearch(users);
    }
    let searchFilter = [];
    users.forEach(user => {
      if (user.username.indexOf(event.target.value) !== -1)
        searchFilter.push(user);
    });
    setUserSearch(searchFilter);
    setUserInput(event.target.value);
  };

  return (
    <div className={classes.courseUsersChatContainer}>
      <form onSubmit={handleSubmit}>
        <TextField
          value={userInput}
          onChange={handleChange}
          margin="normal"
          type="text"
          variant="outlined"
          placeholder="Search for user..."
          autoComplete="off"
        />
      </form>
      <div className={classes.userListContainer}>
        {userSearch.map(u => {
          return (
            <Button
              classes={{ root: classes.userButton }}
              key={u.username}
              component={Link}
              to={'/kudo/' + u.username + '/dm'}
            >
              <ChildCareIcon />
              <Box mx={1}>
                {u.username} {u.username === session.user.id ? ' (You)' : ''}
              </Box>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export { UserSearchForm };
