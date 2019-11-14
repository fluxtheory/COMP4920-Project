import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import { TextField, Button } from '@material-ui/core/';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  UpvoteButtonContainer: {},
  root: {},
}));

function UpvoteButton(props) {
  const classes = useStyles();
  const [upvoted, setUpvoted] = React.useState(props.initialUpvoteState);
  const postId = props.postId;

  return (
    <div className={classes.UpvoteButtonContainer}>
      <Button
        onClick={() => {
          setUpvoted(!upvoted);
        }}
        className={classes.upvoteButton}
      >
        {upvoted ? <StarRoundedIcon /> : <StarBorderRoundedIcon />}
      </Button>
    </div>
  );
}

export { UpvoteButton };
