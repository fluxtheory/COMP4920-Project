import React, { useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Button, Box } from '@material-ui/core';
import { Link } from 'react-router-dom';

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
  const courseInFocus = props.courseInFocus;
  const setCourseInFocus = props.setCourseInFocus;

  return (
    <div className={classes.courseListContainer}>
      {enrolledCourses.map(item => {
        return (
          <Button
            component={Link}
            to={`/kudo/${item.code}`}
            key={item.code}
            className={classes.courseButton}
            variant="contained"
            onClick={() => {
              setCourseInFocus(item.code);
            }}
            color={item.code === courseInFocus ? 'primary' : 'secondary'}
          >
            <Box component={Typography} variant="button">
              {item.code}
            </Box>
          </Button>
        );
      })}
    </div>
  );
}

export { CourseList };
