import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { TextField, Button } from '@material-ui/core/';
import { CourseList } from './CourseList';
import { api } from '../../utils';
import { AddCourseForm } from './AddCourseForm';
import { UserSearchForm } from './UserSearchForm';

const useStyles = makeStyles(theme => ({
  body: {
    display: 'flex',
    position: 'fixed',
    top: '15%',
    bottom: '0%',
    backgroundColor: 'gray',
    width: '100%',
  },
  leftTab: {
    position: 'fixed',
    top: '20%',
    left: '1%',
    margin: '100px 0 0 0',
    height: '500px',
    width: '20%',
  },
  addCourseForm: {},
  courseList: {},
  dashboardButton: {
    margin: '0 auto',
    width: '100%',
    height: '65px',
    display: 'flex',
  },
  centre: {
    position: 'fixed',
    top: '20%',
    left: '21%',
    margin: '100px 0 0 0',
    height: '500px',
    width: '60%',
  },
  root: {
    flexGrow: 1,
    height: '500px',
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
  const [courseInFocus, setCourseInFocus] = React.useState('Dashboard');

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
        const oldCourseList = [...courseList, { code: course }];
        const newCourseList = [];
        Object.keys(oldCourseList)
          .sort()
          .forEach(key => {
            console.log(oldCourseList[key]);
            newCourseList[key] = oldCourseList[key];
          });
        console.log(newCourseList);
        setCourseList([...newCourseList]);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.body}>
        <Paper className={classes.centre}>
          <h1>This is: {courseInFocus}</h1>
          <h3>Find a user:</h3>
          <UserSearchForm courseInFocus={courseInFocus} />
        </Paper>
        <Paper className={classes.leftTab}>
          <Button
            className={classes.dashboardButton}
            variant="contained"
            onClick={() => {
              setCourseInFocus('Dashboard');
            }}
            color={'Dashboard' === courseInFocus ? 'primary' : 'secondary'}
          >
            DASHBOARD
          </Button>
          <div className={classes.courseList}>
            <CourseList
              courseList={courseList}
              courseInFocus={courseInFocus}
              setCourseInFocus={setCourseInFocus}
            />
          </div>
          <AddCourseForm
            className={classes.addCourseForm}
            addCourse={addCourse}
          />
        </Paper>
      </Paper>
    </div>
  );
}

export { CourseBox };