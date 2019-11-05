import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Autocomplete } from '@material-ui/lab/';
import { TextField, Button } from '@material-ui/core/';

const useStyles = makeStyles(theme => ({
  CourseListContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

const allCourses = require('../../text/courses.json');

function AddCourseForm(props) {
  const [newCourse, setNewCourse] = React.useState('');
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
      <Typography component="p">Add New Course:</Typography>
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
      {error ? <h1>{error}</h1> : null}
    </div>
  );
}

export { AddCourseForm };
