import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { UpvoteButton } from './UpvoteButton';
import { useParams } from 'react-router-dom';
import { api } from '../../utils';
import { Session } from '../../App';
import { TextField, Button, Fab, Box } from '@material-ui/core/';
import { MakeComment } from './MakeComment';

const useStyles = makeStyles(theme => ({
  post: {
    margin: '0.7rem 0',
    border: '3px solid red',
    maxheight: '100%',
    maxWidth: '100%',
    overflow: 'auto',
  },
  postTitleSection: {
    position: 'relative',
    top: '2%',
    left: '2%',
    width: '70%',
    maxWidth: '70%',
    maxHeight: '20%',
    float: 'left',
  },
  postTitleText: {
    wordBreak: 'break-all',
  },
  upvoteSection: {
    position: 'relative',
    float: 'right',
    right: '5%',
    top: '2%',
    width: '20%',
  },
  upvoteButton: {},
  upvoteText: {},
  postContentSection: {
    width: '99%',
    height: '50vh',
    margin: '0.5rem',
    float: 'left',
    overflow: 'auto',
  },
  postContent: {},
  postText: { wordBreak: 'break-all', margin: '2% 2% 2% 2%' },
  root: {
    padding: theme.spacing(3, 2),
    height: '100%',
    width: '100%',
  },
}));

function Comment(props) {
  const classes = useStyles();
  const allPosts = props.allPosts;
  const session = React.useContext(Session);
  const depth = props.depth;
  const [comments, setComments] = React.useState(allPosts);
  const [thisPost, setThisPost] = React.useState(props.thisPost);
  const [makingComment, setMakingComment] = React.useState(false);
  const [kudos, setKudos] = React.useState(thisPost.kudos);

  return (
    <div className={classes.root}>
      <Paper className={classes.post}>
        <Paper className={classes.postTitleSection}>
          <Typography
            className={classes.postTitleText}
            variant="h5"
            component="h3"
          >
            {thisPost ? thisPost.title : 'loading...'}
          </Typography>
        </Paper>
        <Paper className={classes.upvoteSection}>
          <div className={classes.upvoteButton}>
            {thisPost ? (
              <UpvoteButton
                thisPost={thisPost}
                kudos={kudos}
                setKudos={setKudos}
              />
            ) : (
              <div></div>
            )}
          </div>
          <Typography className={classes.upvoteText} component="p">
            {thisPost ? kudos : 'loading...'}
          </Typography>
        </Paper>
        <Paper className={classes.postContentSection}>
          <Typography className={classes.postText} variant="h5" component="h3">
            {thisPost
              ? thisPost.postContent
                  .split('\n')
                  .map((item, i) => <p key={i}>{item}</p>)
              : 'loading...'}
          </Typography>
        </Paper>
      </Paper>
      <div className={classes.makeCommentBox}>
        <Fab
          onClick={() => setMakingComment(!makingComment)}
          // variant="contained"
          size="medium"
          color="secondary"
        >
          {makingComment ? '-' : '+'}
        </Fab>
        {thisPost && makingComment ? (
          <MakeComment
            depth={depth + 1}
            rootId={thisPost.rootId}
            branchId={thisPost.id}
          />
        ) : null}
      </div>
      <div>
        {thisPost
          ? comments.map(p => {
              if (p.branchId == thisPost.id)
                return (
                  <Comment
                    depth={depth + 1}
                    allPosts={comments}
                    thisPost={p}
                    key={p.id}
                  />
                );
            })
          : null}
      </div>
    </div>
  );
}

export { Comment };
