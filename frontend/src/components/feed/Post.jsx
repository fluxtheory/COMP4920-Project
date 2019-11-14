import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { UpvoteButton } from './UpvoteButton';

const useStyles = makeStyles(theme => ({
  PostContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  post: {
    margin: '0.7rem 0',
    backgroundColor: 'cream',
    border: '3px solid red',
  },
  postSection: {
    width: '70%',
    height: '100%',
    margin: '0.5rem',
    float: 'left',
  },
  upvoteSection: {
    width: '20%',
    height: '80%',
    margin: '0.5rem',
    float: 'left',
  },
  upvoteButton: {
    margin: 'auto',
    width: '50%',
    padding: '10px',
    display: 'flex',
    justifyContent: 'center',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function Post() {
  const classes = useStyles();

  return (
    <div className={classes.PostContainer}>
      <Paper className={classes.post}>
        <Paper className={classes.postSection}>
          <Typography
            className={classes.postSection}
            variant="h5"
            component="h3"
          >
            Title
          </Typography>
        </Paper>
        <Paper className={classes.upvoteSection}>
          <div className={classes.upvoteButton}>
            <UpvoteButton initialUpvoteState={false} />
          </div>
          <Typography className={classes.upvoteButton} component="p">
            Upvotes
          </Typography>
        </Paper>
      </Paper>
    </div>
  );
}

export { Post };
