import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { UpvoteButton } from './UpvoteButton';
import { Link } from 'react-router-dom';

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

function Comment(props) {
  const classes = useStyles();
  const post = props.thisPost;
  const allPosts = props.allPosts;
  const children = allPosts.filter(i => i.branchId === post.id);
  console.log(children);

  return (
    <div className={classes.PostContainer}>
      <Paper className={classes.post}>
        <Link to={'post/' + post.id}>
          <Paper className={classes.postSection}>
            <Typography
              className={classes.postSection}
              variant="h5"
              component="h3"
            >
              {post.content}
            </Typography>
          </Paper>
        </Link>
        <Paper className={classes.upvoteSection}>
          <div className={classes.upvoteButton}>
            <UpvoteButton initialUpvoteState={false} />
          </div>
          <Typography className={classes.upvoteButton} component="p">
            {post.kudos}
          </Typography>
        </Paper>
        <div>
          {children.map(p => {
            if (p.id !== post.id)
              return <Comment allPosts={allPosts} thisPost={p} key={p.id} />;
          })}
        </div>
      </Paper>
    </div>
  );
}

export { Comment };
