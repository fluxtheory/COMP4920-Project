import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { UpvoteButton } from './UpvoteButton';
import { Link } from 'react-router-dom';
import { theme } from '../../App';
import { User } from '../User';

const useStyles = makeStyles(theme => ({
  PostContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  post: {
    margin: '0.7rem 0',
    border: '2px solid ' + theme.palette.secondary.main,
  },
  postSection: {
    width: '70%',
    height: '100%',
    margin: '0.5rem',
    float: 'left',
    wordBreak: 'break-all',
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

function PostCompact(props) {
  const classes = useStyles();
  const post = props.post;
  const [kudos, setKudos] = React.useState(post.kudos);

  return (
    <div className={classes.PostContainer}>
      <Paper
        className={classes.post}
        style={
          post.sticky === 1
            ? { border: '2px solid ' + theme.palette.primary.main }
            : {}
        }
      >
        <Link to={'post/' + post.id}>
          <Paper className={classes.postSection}>
            <Typography
              className={classes.postSection}
              variant="h5"
              component="h3"
            >
              {post.title}
            </Typography>
          </Paper>
        </Link>
        <Paper className={classes.upvoteSection}>
          <div className={classes.upvoteButton}>
            {post ? (
              <UpvoteButton thisPost={post} kudos={kudos} setKudos={setKudos} />
            ) : (
              <div></div>
            )}
          </div>
          <Typography className={classes.upvoteButton} component="p">
            {kudos}
          </Typography>
        </Paper>
        {post ? <User username={post.userId} /> : <div></div>}
      </Paper>
    </div>
  );
}

export { PostCompact };
