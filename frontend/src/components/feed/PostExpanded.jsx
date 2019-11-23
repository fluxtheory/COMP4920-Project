import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { UpvoteButton } from './UpvoteButton';
import { useParams } from 'react-router-dom';
import { api } from '../../utils';
import { Session } from '../../App';
import { Comment } from './Comment';
import { TextField, Button, Fab, Box } from '@material-ui/core/';
import { MakeComment } from './MakeComment';
import CommentIcon from '@material-ui/icons/Comment';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';

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
  upvoteButton: {
    position: 'relative',
    align: 'centre',
  },
  upvoteText: {
    position: 'relative',
    align: 'centre',
  },
  postContentSection: {
    width: '99%',
    height: '50%',
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
    overflow: 'auto',
  },
}));

const getPostAndChildren = function(postId) {
  return new Promise((resolve, reject) => {
    api
      .get('/post/' + postId)
      .then(resp => {
        console.log(resp.data);
        resolve(resp.data);
      })
      .catch(err => {
        console.log(err);
        reject([]);
      });
  });
};

function PostExpanded() {
  const classes = useStyles();
  const postId = useParams().postId;
  const session = React.useContext(Session);
  const [comments, setComments] = React.useState([]);
  const [thisPost, setThisPost] = React.useState(null);
  const [makingComment, setMakingComment] = React.useState(false);
  const [kudos, setKudos] = React.useState(0);

  React.useEffect(() => {
    const prom = getPostAndChildren(postId).then(resp => {
      console.log(resp);
      console.log(postId);
      const post = resp.find(i => i.id.toString() === postId);
      setThisPost(post);
      setKudos(post.kudos);
      setComments(resp);
    });
  }, [postId]);

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
        <Fab
          onClick={() => setMakingComment(!makingComment)}
          style={({ float: 'left' }, { margin: '2%' })}
          // variant="contained"
          size="medium"
          color="secondary"
        >
          {makingComment ? <CommentOutlinedIcon /> : <CommentIcon />}
        </Fab>
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
        {thisPost && makingComment ? (
          <MakeComment rootId={thisPost.id} branchId={thisPost.id} />
        ) : null}
      </div>
      <div>
        {thisPost
          ? comments.map(p => {
              if (p.branchId == postId)
                return (
                  <Comment
                    depth={0}
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

export { PostExpanded };
