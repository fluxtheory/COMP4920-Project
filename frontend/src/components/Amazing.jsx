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

function Amazing() {
  const classes = useStyles();

  return (
    <div className={classes.amazingContainer}>
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3">
          Welcome to Kudo!
        </Typography>
        <Typography component="p">This will be a home screen</Typography>
      </Paper>
    </div>
  );
}

export { Amazing };
