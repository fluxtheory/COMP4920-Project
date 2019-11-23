import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { PostList } from './PostList';
import { Button, Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  CourseFeedContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function CourseFeed(props) {
  const classes = useStyles();
  const course = useParams().course;

  return (
    <div className={classes.CourseFeedContainer}>
      <PostList />
      <Button
        style={{ left: '60%' }}
        component={Link}
        to={`/kudo/${course}/feed/new`}
        variant="contained"
        color="secondary"
      >
        Make a new Post
      </Button>
    </div>
  );
}

export { CourseFeed };
