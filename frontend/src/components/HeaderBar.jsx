import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TextField, Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  creationContainer: {
    maxWidth: '1000px',
    margin: '200px',
  },
  logoutButtonStyle: {
    margin: '0 10px 10px 10px',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400,
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function HeaderBar() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    nameOrEmail: '',
    password: '',
  });

  const [loginHelpString, setLoginHelpString] = React.useState('');
  const [loginSuccess, setLoginSuccess] = React.useState(false);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const logout = () => {
    return;
  };

  return (
    <div>
      <Paper className={classes.logoutButtonStyle}>
        <Button
          className={classes.logoutButtonStyle}
          align="right"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </Button>
      </Paper>
    </div>
  );
}

export { HeaderBar };
