import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import { TextField, Button } from '@material-ui/core/';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { api } from '../../utils';
import { Session } from '../../App';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  UpvoteButtonContainer: {},
  root: {},
}));

const getUpvoteStatus = function(course, postId, userId) {
  return new Promise((resolve, reject) => {
    api
      .post('/' + course + '/feed/' + postId + '/upvoteStatus', {
        username: userId,
      })
      .then(resp => {
        resolve(resp.data);
      })
      .catch(err => {
        console.log(err);
        reject(false);
      });
  });
};

function UpvoteButton(props) {
  const classes = useStyles();
  const [upvoted, setUpvoted] = React.useState(false);
  const thisPost = props.thisPost;
  const session = React.useContext(Session);
  const postId = thisPost.id;
  const course = useParams().course;
  let kudos = props.kudos;
  const setKudos = props.setKudos;

  React.useEffect(() => {
    const prom = getUpvoteStatus(course, postId, session.user.id).then(resp => {
      setUpvoted(resp.data);
    });
  }, [thisPost]);

  const onVote = e => {
    api
      .post('/' + course + '/feed/' + postId + '/upvote', {
        username: session.user.id,
      })
      .then(resp => {
        if (upvoted) setKudos(kudos - 1);
        else setKudos(kudos + 1);
        setUpvoted(!upvoted);
      });
  };

  return (
    <div className={classes.UpvoteButtonContainer}>
      <Button
        onClick={() => {
          onVote();
        }}
        className={classes.upvoteButton}
      >
        {upvoted ? (
          <StarRoundedIcon fontSize="large" color="secondary" />
        ) : (
          <StarBorderRoundedIcon fontSize="large" color="primary" />
        )}
      </Button>
    </div>
  );
}

export { UpvoteButton };
