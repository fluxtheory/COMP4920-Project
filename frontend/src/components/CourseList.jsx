import React from 'react';
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

const allCourses = require('../text/courses.json');

function CourseList() {
  const classes = useStyles();

  const [enrolledCourses, setEnrolledCourses] = React.useState([]);
  const [newCourse, setNewCourse] = React.useState('');

  const addCourse = () => {
    if (newCourse !== '') setEnrolledCourses({ ...enrolledCourses, newCourse });
    console.log(enrolledCourses);
  };
  return (
    <div className={classes.CourseListContainer}>
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3">
          Courses
        </Typography>
        <Typography component="p">Add New Course:</Typography>
        <Autocomplete
          options={allCourses}
          getOptionLabel={option => option.code}
          style={{ width: 300 }}
          renderInput={params => (
            <TextField
              {...params}
              value={newCourse}
              variant="outlined"
              fullWidth
            />
          )}
        />
        <div align="right">
          <Button onClick={addCourse()}>Add</Button>
        </div>
      </Paper>
    </div>
  );
}

export { CourseList };
