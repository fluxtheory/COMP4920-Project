import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AccountCreationHandler } from '../components/AccountCreationHandler';

const useStyles = makeStyles(theme => ({
  UsernameContainer: {
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
    <div className={classes.UsernameContainer}>
      <AccountCreationHandler />
    </div>
  );
}

export { CreateAccount };
