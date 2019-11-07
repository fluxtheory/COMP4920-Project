import React, { useEffect } from 'react';
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
    // margin: '0.5rem 0.1rem',
    flex: '0 0 4rem',
  },
  // root: {
  //   padding: theme.spacing(3, 2),
  // },
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
            <Box fontSize="1.5rem">{item.code}</Box>
          </Button>
        );
      })}
    </div>
  );
}

export { CourseList };
