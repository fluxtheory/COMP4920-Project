import React, { useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Button, Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { LeftPaneButton } from './CoursesPane';

const useStyles = makeStyles(theme => ({
  courseListContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  courseButton: {
    flex: '0 0 4rem',
    margin: '0.2rem 0',
  },
}));

function CourseList(props) {
  const classes = useStyles();

  const enrolledCourses = props.courseList;

  return (
    <div className={classes.courseListContainer}>
      {enrolledCourses.map(item => {
        return (
          <LeftPaneButton
            component={Link}
            to={`/kudo/${item.code}/dashboard`}
            key={item.code}
            className={classes.courseButton}
            variant="contained"
            activeRoute={item.code}
          >
            <Box component={Typography} variant="button">
              {item.code}
            </Box>
          </LeftPaneButton>
        );
      })}
    </div>
  );
}

export { CourseList };
