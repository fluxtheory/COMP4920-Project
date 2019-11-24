import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AccountCreationHandler } from '../components/AccountCreationHandler';

const useStyles = makeStyles(theme => ({
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundImage: 'url(' + require('../img/naturebg.jpg') + ')',
    backgroundPosition: 'centre',
    backgroundSize: 'cover',
  },
  ACHContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function CreateAccount() {
  const classes = useStyles();
  return (
    <div className={classes.background}>
      <div className={classes.ACHContainer}>
        <AccountCreationHandler />
      </div>
    </div>
  );
}

export { CreateAccount };
