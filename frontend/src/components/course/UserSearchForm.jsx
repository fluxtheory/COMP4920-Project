import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core/';
import { api } from '../../utils';
import { Autocomplete } from '@material-ui/lab/';
import { Typography, Box } from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {},
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
  const course = params.course;
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
    <div>
      <form onSubmit={handleSubmit}>
        <Autocomplete
          //className={}
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
      <Typography component="div">
        <Box margin="10px" fontWeight="fontWeightBold">
          All Users:
        </Box>
      </Typography>
      <ul>
        {users.map(u => {
          return <Button key={u.username}>{u.username}</Button>;
        })}
      </ul>
    </div>
  );
}

export { UserSearchForm };
