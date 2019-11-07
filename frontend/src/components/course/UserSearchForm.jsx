import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core/';
import { api } from '../../utils';
import { Autocomplete } from '@material-ui/lab/';
import { resolve } from 'url';

const useStyles = makeStyles(theme => ({
  root: {},
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
}

function UserSearchForm(props) {
  const classes = useStyles();

  const course = props.courseInFocus;
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    const prom = getAllUsers(course).then((resp) => {
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

  return (<div><form onSubmit={handleSubmit}>
    <Autocomplete
      //className={}
      options={users}
      getOptionLabel={option => option.username}
      onChange={handleChange}
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          label="Enter username"
          value={userInput}
          fullWidth
        />
      )}
    />
  </form></div>);

}

export { UserSearchForm };
