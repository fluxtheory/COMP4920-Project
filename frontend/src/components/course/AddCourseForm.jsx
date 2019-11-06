import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Autocomplete } from '@material-ui/lab/';
import { TextField, Button } from '@material-ui/core/';
import { mergeClasses } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  CourseListContainer: {
    margin: '0',
    position: 'absolute',
    top: '50%',
  },
  toggleButton: {
    margin: '0 auto',
    width: '100%',
    display: 'flex',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

const allCourses = require('../../text/courses.json');

function AddCourseForm(props) {
  const classes = useStyles();

  const [newCourse, setNewCourse] = React.useState('');
  const [searchbarVisible, setSearchbarVisible] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = (event, value) => {
    if (!value) return setNewCourse('');
    setNewCourse(value.code);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (newCourse === '') return setError('Enter a course plz');
    if (newCourse !== '') {
      props.addCourse(newCourse);
    }
  };

  return (
    <div>
      {searchbarVisible ? (
        <form onSubmit={handleSubmit}>
          <Autocomplete
            options={allCourses}
            getOptionLabel={option => option.code}
            style={{ width: 300 }}
            onChange={handleChange}
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                value={newCourse}
                fullWidth
              />
            )}
          />
          <div align="right">
            <Button type="submit">Add</Button>
          </div>
        </form>
      ) : null}
      <Button
        className={classes.toggleButton}
        onClick={() => setSearchbarVisible(!searchbarVisible)}
        variant="contained"
        color="secondary"
      >
        {searchbarVisible ? '-' : 'Add Course'}
      </Button>

      {error ? <h1>{error}</h1> : null}
    </div>
  );
}

export { AddCourseForm };
