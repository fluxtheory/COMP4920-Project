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
  const [posts, setPosts] = React.useState([]);
  const [thisPost, setThisPost] = React.useState(null);

  React.useEffect(() => {
    const prom = getPostAndChildren(postId).then(resp => {
      console.log(resp);
      console.log(postId);
      setThisPost(resp.find(i => i.id.toString() === postId));
      //setPosts(resp);
      console.log(thisPost);
    });
  }, [postId]);

  return (
    <div className={classes.PostContainer}>
      <Paper className={classes.post}>
        <Paper className={classes.postSection}>
          <Typography
            className={classes.postSection}
            variant="h5"
            component="h3"
          >
            {thisPost ? thisPost.title : 'lol'}
          </Typography>
        </Paper>
        <Paper className={classes.postSection}>
          <Typography
            className={classes.postSection}
            variant="h5"
            component="h3"
          >
            {thisPost ? thisPost.postContent : 'lol'}
          </Typography>
        </Paper>
        <Paper className={classes.upvoteSection}>
          <div className={classes.upvoteButton}>
            <UpvoteButton initialUpvoteState={false} />
          </div>
          <Typography className={classes.upvoteButton} component="p">
            {thisPost ? thisPost.kudos : 'lol'}
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
