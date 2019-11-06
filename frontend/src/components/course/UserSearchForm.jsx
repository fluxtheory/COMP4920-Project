import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core/';
import { api } from '../../utils';

const useStyles = makeStyles(theme => ({
  root: {},
}));

function UserSearchForm(props) {
  const classes = useStyles();

  const course = props.courseInFocus;
  const [userInput, setUserInput] = React.useState('');
  const [users, setUsers] = React.useState([]);

  const handleSubmit = e => {
    e.preventDefault();
    // Need to fetch all users with partial string match, rather than all
    api
      .get('/' + course + '/users')
      .then(resp => {
        setUsers(resp.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleChange = event => {
    setUserInput(event.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField value={userInput} onChange={handleChange} />
      </form>
      <div>
        {users.map(item => {
          return <li key={item.username}>{item.username}</li>;
        })}
      </div>
    </div>
  );
}

export { UserSearchForm };
