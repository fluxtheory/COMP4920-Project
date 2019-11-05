import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  CourseListContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function CourseList(props) {
  const classes = useStyles();

  const enrolledCourses = props.courseList;

  return (
    <div className={classes.CourseListContainer}>
      <Typography variant="h5" component="h3">
        Courses
      </Typography>
      {enrolledCourses.map(item => {
        return (
          <li key={item.code} className="list-group-item list-group-item-info">
            {item.code}
          </li>
        );
      })}
    </div>
  );
}

export { CourseList };
