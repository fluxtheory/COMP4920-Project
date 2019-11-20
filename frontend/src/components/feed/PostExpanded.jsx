import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { UpvoteButton } from './UpvoteButton';
import { useParams } from 'react-router-dom';
import { api } from '../../utils';
import { Session } from '../../App';
import { Comment } from './Comment';

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
  postTitleSection: {
    width: '70%',
    height: '100%',
    margin: '0.5rem',
    float: 'left',
    overflow: 'auto',
  },
  postContentSection: {
    width: '99%',
    height: '50vh',
    margin: '0.5rem',
    float: 'left',
    overflow: 'auto',
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
  const [kudos, setKudos] = React.useState(0);

  React.useEffect(() => {
    const prom = getPostAndChildren(postId).then(resp => {
      console.log(resp);
      console.log(postId);
      const post = resp.find(i => i.id.toString() === postId);
      setThisPost(post);
      setKudos(post.kudos);
      //setComments(resp);
      console.log(thisPost);
    });
  }, [postId]);

  return (
    <div className={classes.PostContainer}>
      <Paper className={classes.post}>
        <Paper className={classes.postTitleSection}>
          <Typography
            className={classes.postTitleSection}
            variant="h5"
            component="h3"
          >
            {thisPost ? thisPost.title : 'loading...'}
          </Typography>
        </Paper>
        <Paper className={classes.postTitleSection}>
          <Typography
            className={classes.postContentSection}
            variant="h5"
            component="h3"
          >
            {thisPost
              ? thisPost.postContent
                  .split('\n')
                  .map((item, i) => <p key={i}>{item}</p>)
              : 'loading...'}
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
          <Typography className={classes.upvoteButton} component="p">
            {thisPost ? kudos : 'loading...'}
          </Typography>
        </Paper>
      </Paper>
      <div>
        {/*posts.map(p => {
          if (p.id !== postId) {
            return <Comment allPosts={posts} thisPost={p} key={p.id} />;
          */}
      </div>
    </div>
  );
}

export { PostExpanded };
