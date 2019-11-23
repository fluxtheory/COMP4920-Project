import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { TextField, Button, Box, Typography } from '@material-ui/core/';
import { CourseList } from './CourseList';
import { api } from '../../utils';
import { AddCourseForm } from './AddCourseForm';
import { Session } from '../../App';

const useStyles = makeStyles(theme => ({
  dashboardButton: {
    margin: '0 auto',
    width: '100%',
    height: '65px',
    display: 'flex',
  },

  courseBoxWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: theme.palette.background.level2,

    height: '100%',
  },
}));

const getEnrolledCourses = username =>
  new Promise((resolve, reject) => {
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

function CoursesPane() {
  const classes = useStyles();
  const [courseList, setCourseList] = React.useState([]);
  const [courseInFocus, setCourseInFocus] = React.useState('Dashboard');
  const session = React.useContext(Session);
  const username = session.user.id;

  React.useEffect(() => {
    getEnrolledCourses(username).then(ret => {
      setCourseList([...ret]);
    });
  }, [username]);

  const addCourse = course => {
    api
      .post('/' + course + '/enrol', {
        username,
      })
      .then(() => {
        const oldCourseList = [...courseList, { code: course }];
        const newCourseList = [];
        Object.keys(oldCourseList)
          .sort()
          .forEach(key => {
            newCourseList[key] = oldCourseList[key];
          });
        setCourseList([...newCourseList]);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Box className={classes.courseBoxWrapper}>
      <Box>
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
      </Box>
      <Button
        className={classes.dashboardButton}
        variant="contained"
        onClick={() => {}}
        color={'Dashboard' === courseInFocus ? 'primary' : 'secondary'}
        component={Link}
        to={'/kudo/dashboard'}
      >
        Overview
      </Button>
    </Box>
  );
}

export { CoursesPane };
