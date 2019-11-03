import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  amazingContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));


function AuthProtection() {
  const classes = useStyles();

  if (!localStorage.hasOwnProperty('userToken')) {
    return <Redirect to="/login" />;
  }
  return (
    <div className={classes.amazingContainer}>
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3">
          How Amazing is this?
        </Typography>
        <Typography component="p">jonsnow420blazeit</Typography>
      </Paper>
    </div>
  );
}

export { AuthProtection };
