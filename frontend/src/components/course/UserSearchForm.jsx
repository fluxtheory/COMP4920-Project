import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core/';
import { api } from '../../utils';
import { Autocomplete } from '@material-ui/lab/';
import { Typography, Box } from '@material-ui/core';
import ChildCareIcon from '@material-ui/icons/ChildCare';

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
      .get('/users')
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

  const course = props.courseInFocus;
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    const prom = getAllUsers(course).then(resp => {
      setUsers(resp);
    });
  }, [course]);
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
      <form onSubmit={handleSubmit}>
        <Autocomplete
          options={users}
          getOptionLabel={option => option.username}
          onChange={handleChange}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Search for user..."
              value={userInput}
              fullWidth
            />
          )}
        />
      </form>
      <div className={classes.userListContainer}>
        {users.map(u => {
          return (
            <Button classes={{ root: classes.userButton }} key={u.username}>
              <ChildCareIcon />
              <Box mx={1}>{u.username}</Box>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export { UserSearchForm };
