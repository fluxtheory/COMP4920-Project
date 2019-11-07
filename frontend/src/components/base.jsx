import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  something: {},
}));

function Base() {
  const classes = useStyles();

  return (
    <div className={classes.something}>
      <h1>Your Content</h1>
    </div>
  );
}

export { Base };
