import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab/';
import { TextField, Button, Fab, Box } from '@material-ui/core/';

const useStyles = makeStyles(theme => ({
  toggleButton: {
    margin: '1rem 0',
  },
  courseForm: {
    width: '100%',
  },
  courseFormWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1rem auto',
  },
}));

const allCourses = require('../../text/courses.json');

function AddCourseForm(props) {
  const classes = useStyles();

  const [newCourse, setNewCourse] = React.useState('');
  const [searchbarVisible, setSearchbarVisible] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = (event, value) => {
    if (!value) {
      props.addCourse(newCourse);
      return setNewCourse('');
    }
    setNewCourse(value.code);
  };

  return (
    <div className={classes.courseFormWrapper}>
      {searchbarVisible ? (
        <Autocomplete
          className={classes.courseForm}
          options={allCourses}
          autoHightlight
          autoSelect
          onChange={handleChange}
          getOptionLabel={option =>
            (option && option.code) || `Weird option value: ${option}`
          }
          renderInput={params => (
            <TextField
              {...params}
              onChange={handleChange}
              variant="outlined"
              placeholder="Enter course name/code"
              autoFocus
              fullWidth
            />
          )}
        />
      ) : null}
      <Fab
        className={classes.toggleButton}
        onClick={() => setSearchbarVisible(!searchbarVisible)}
        // variant="contained"
        size="medium"
        color="secondary"
      >
        {searchbarVisible ? '-' : '+'}
      </Fab>

      {error ? <h1>{error}</h1> : null}
    </div>
  );
}

export { AddCourseForm };
