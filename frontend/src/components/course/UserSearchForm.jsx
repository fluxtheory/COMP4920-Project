import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core/';
import { api, useCourse } from '../../utils';
import { Autocomplete } from '@material-ui/lab/';
import { Typography, Box } from '@material-ui/core';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import { useRouteMatch, Link } from 'react-router-dom';
import { Session } from '../../App';
import Popup from 'reactjs-popup';
import { UserInfoSheet } from '../UserInfoSheet';
import { User } from '../User';

const useStyles = makeStyles(theme => ({
  userListContainer: {},
  courseUsersChatContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
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

  const session = React.useContext(Session);
  const course = useCourse();
  const [users, setUsers] = React.useState([]);
  const [userSearch, setUserSearch] = React.useState([]);

  React.useEffect(() => {
    const prom = getAllUsers(course).then(resp => {
      resp.sort((a, b) => {
        let x = a.username < b.username ? -1 : 1;
        return x;
      });
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
          fullWidth
        />
      </form>
      <div className={classes.userListContainer}>
        {userSearch.map(u => {
          return <User key={u.username} username={u.username} />;
        })}
      </div>
    </div>
  );
}

export { UserSearchForm };
