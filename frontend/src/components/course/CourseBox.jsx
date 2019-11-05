import React, { useEffect } from 'react';
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

let username = localStorage.getItem('username');

const getEnrolledCourses = new Promise((resolve, reject) => {
  api
    .get('/' + username + '/courses')
    .then(resp => {
      console.log(resp);
      resolve(resp.data);
    })
    .catch(err => {
      console.log(err);
      reject([]);
    });
});

function CourseBox() {
  const classes = useStyles();
  const [courseList, setCourseList] = React.useState([]);

  React.useEffect(() => {
    username = localStorage.getItem('username');
    getEnrolledCourses.then(ret => {
      setCourseList([...ret]);
    });
  }, []);

  const addCourse = course => {
    api
      .post('/' + course + '/enrol', {
        username,
      })
      .then(response => {
        console.log(response);
        setCourseList([...courseList, { code: course }]);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <CourseList courseList={courseList} addCourse={addCourse} />
    </div>
  );
}

export { CourseBox };
