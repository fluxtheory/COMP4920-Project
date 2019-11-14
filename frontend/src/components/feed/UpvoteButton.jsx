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

function UpvoteButton(props) {
  const classes = useStyles();
  const [upvoted, setUpvoted] = React.useState(props.initialUpvoteState);
  const thisPost = props.thisPost;
  console.log(thisPost);
  const postId = thisPost.id;
  const course = useParams().course;

  const onVote = e => {
    api.post('/' + course + '/feed/' + postId + '/upvote', {}).then(resp => {
      if (upvoted) thisPost.kudos--;
      else thisPost.kudos++;
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
        {upvoted ? <StarRoundedIcon /> : <StarBorderRoundedIcon />}
      </Button>
    </div>
  );
}

export { UpvoteButton };
