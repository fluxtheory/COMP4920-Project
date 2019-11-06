import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  courseListContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  courseButton: {
    margin: '0 auto',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function CourseList(props) {
  const classes = useStyles();

  const enrolledCourses = props.courseList;
  const courseInFocus = props.courseInFocus;
  const setCourseInFocus = props.setCourseInFocus;

  return (
    <div className={classes.courseListContainer}>
      {enrolledCourses.map(item => {
        return (
          <Button
            key={item.code}
            classname={classes.courseButton}
            variant="contained"
            onClick={() => {
              setCourseInFocus(item.code);
            }}
            color={item.code === courseInFocus ? 'primary' : 'secondary'}
          >
            {item.code}
          </Button>
        );
      })}
    </div>
  );
}

export { CourseList };
