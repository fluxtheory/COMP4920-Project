import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LoginBox } from '../components/LoginBox';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundImage: 'url(' + require('../img/naturebg.jpg') + ')',
    backgroundPosition: 'centre',
    backgroundSize: 'cover',
  },
  LoginContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function Login(props) {
  const classes = useStyles();
  const location = useLocation();
  const sneakyBastard = location.state ? location.state.sneakyBastard : null;
  return (
    <div className={classes.background}>
      <div className={classes.LoginContainer}>
        {sneakyBastard ? <h1>WTF?!?! LOGIN FIRST BRO!</h1> : null}
        <LoginBox />
      </div>
    </div>
  );
}

export { Login };
