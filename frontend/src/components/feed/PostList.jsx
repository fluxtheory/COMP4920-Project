import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Post } from './Post';
import { useRouteMatch, Link } from 'react-router-dom';
import { Session } from '../../App';
import { api } from '../../utils';

const useStyles = makeStyles(theme => ({
  PostListContainer: {
    display: 'flex',
    flexDirection: 'column',
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
      console.log(resp);
      setPosts(resp);
    });
  }, [course]);

  return (
    <div className={classes.PostListContainer}>
      <ul>
        <Post />
        <Post />
        <Post />
      </ul>
    </div>
  );
}

export { PostList };
