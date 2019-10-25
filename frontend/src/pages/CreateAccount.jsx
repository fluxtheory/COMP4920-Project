import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AccountCreationHandler } from '../components/AccountCreationHandler';

const useStyles = makeStyles(theme => ({
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
    <div className={classes.ACHContainer}>
      <AccountCreationHandler />
    </div>
  );
}

export { CreateAccount };
