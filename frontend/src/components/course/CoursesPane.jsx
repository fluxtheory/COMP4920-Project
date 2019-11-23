import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useRouteMatch } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@material-ui/core/';
import { CourseList } from './CourseList';
import { api, useUsername } from '../../utils';
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
        resolve(resp.data);
      })
      .catch(err => {
        console.log(err);
        reject([]);
      });
  });

export const LeftPaneButton = ({ children, activeRoute, ...props }) => {
  const { params } = useRouteMatch('/kudo/:activeRoute');
  const isActive = activeRoute === params.activeRoute;
  return (
    <Button color={isActive ? 'secondary' : 'primary'} {...props}>
      {children}
    </Button>
  );
};

function CoursesPane() {
  const classes = useStyles();
  const [courseList, setCourseList] = React.useState([]);
  const [courseInFocus, setCourseInFocus] = React.useState('Dashboard');
  const username = useUsername();

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
      <LeftPaneButton
        className={classes.dashboardButton}
        variant="contained"
        activeRoute="dashboard"
        component={Link}
        to={'/kudo/dashboard'}
      >
        Overview
      </LeftPaneButton>
    </Box>
  );
}

export { CoursesPane };
