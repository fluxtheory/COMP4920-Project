import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { TextField, Button } from '@material-ui/core/';
import { CourseList } from './CourseList';
import { api } from '../../utils';
import { AddCourseForm } from './AddCourseForm';
import { UserSearchForm } from './UserSearchForm';
import { PublicChat } from '../PublicChat';

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
  rightTab: {
    position: 'fixed',
    top: '20%',
    left: '81%',
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
    //height: '500px',
    width: '60%',
  },
  centreWrapper: {
    margin: '10% 10% 10% 10%',
  },
  root: {
    flexGrow: 1,
    height: '500px',
  },
}));

let username = localStorage.getItem('username');
const FOCUS_DEFAULT = "Overview"

const getEnrolledCourses = new Promise((resolve, reject) => {
  api
    .get('/' + username + '/courses')
    .then(resp => {
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
  const [courseInFocus, setCourseInFocus] = React.useState(FOCUS_DEFAULT);

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
          <div className={classes.centreWrapper}>
          <h1>This is: {courseInFocus}</h1>
          <h3>Find a user:</h3>
          <UserSearchForm courseInFocus={courseInFocus} />
          <PublicChat forCourse={courseInFocus}/>
          </div>
        </Paper>
        <Paper className={classes.leftTab}>
          <Button
            className={classes.dashboardButton}
            variant="contained"
            onClick={() => {
              setCourseInFocus(FOCUS_DEFAULT);
            }}
            color={FOCUS_DEFAULT === courseInFocus ? 'primary' : 'secondary'}
          >
            {FOCUS_DEFAULT}
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
        <Paper className={classes.rightTab}>
          
        </Paper>
      </Paper>
    </div>
  );
}

export { CourseBox };
