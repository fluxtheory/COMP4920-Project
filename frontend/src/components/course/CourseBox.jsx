import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Autocomplete } from '@material-ui/lab/';
import { TextField, Button } from '@material-ui/core/';
import { AuthProtection } from '../AuthProtection';
import { CourseList } from './CourseList';
import { api } from '../../utils';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function CourseBox() {
  const classes = useStyles();

  const [courseList, setCourseList] = React.useState([]);

  const addCourse = course => {
    api
      .post('/' + course + '/enrol', {
        username: localStorage.getItem('username'),
      })
      .then(response => {
        console.log(response);
      });
  };

  return (
    <div>
      <CourseList courseList={courseList} addCourse={addCourse} />
    </div>
  );
}

export { CourseBox };
