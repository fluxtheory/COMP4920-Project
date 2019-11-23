import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { PostCompact } from './PostCompact';
import { useRouteMatch, Link } from 'react-router-dom';
import { Session } from '../../App';
import { api } from '../../utils';

const useStyles = makeStyles(theme => ({
  PostListContainer: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  userListContainer: {
    display: 'flex',
    maxHeight: '80vh',
    flexDirection: 'column',
    overflow: 'auto',
  },
  root: {},
}));

const getPosts = function(course) {
  return new Promise((resolve, reject) => {
    api
      .get('/' + course + '/feed')
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

function PostList() {
  const classes = useStyles();

  const { params } = useRouteMatch('/kudo/:course/feed');
  const session = React.useContext(Session);
  const course = params.course;
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    const prom = getPosts(course).then(resp => {
      let stickiedPosts = [];
      let normalPosts = [];
      console.log(resp);
      resp.forEach(post => {
        if (post.sticky === 1) stickiedPosts.push(post);
        else normalPosts.push(post);
      });
      console.log(stickiedPosts.concat(normalPosts));
      setPosts(stickiedPosts.concat(normalPosts));
    });
  }, [course]);

  return (
    <div className={classes.PostListContainer}>
      <div className={classes.userListContainer}>
        {posts.map(p => {
          return <PostCompact post={p} key={p.id} />;
        })}
      </div>
    </div>
  );
}

export { PostList };
