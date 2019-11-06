import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core/';

const useStyles = makeStyles(theme => ({
  root: {},
}));

function UserSearchForm(props) {
  const classes = useStyles();

  const course = props.courseInFocus;

  const handleSubmit = e => {
    e.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField />
      </form>
      {
        // User inputs string, dynamic list updates to show all partial matches
      }
    </div>
  );
}

export { UserSearchForm };
