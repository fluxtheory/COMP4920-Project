import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LoginBox } from '../components/LoginBox';

const useStyles = makeStyles(theme => ({
  LoginContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function Login() {
  const classes = useStyles();
  return (
    <div className={classes.LoginContainer}>
      <LoginBox />
    </div>
  );
}

export { Login };
