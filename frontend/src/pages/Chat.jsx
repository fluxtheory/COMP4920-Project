import React from 'react';
import { Amazing } from '../components/Amazing';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  chatPage: {
    height: '100%',
    width: '100%',
  },
  spicyTrap: {
    objectFit: 'fill',
    height: '100%',
    width: '100%',
  },
});

const Chat = () => {
  const classes = useStyles();
  return (
    <div className={classes.chatPage}>
      <img
        className={classes.spicyTrap}
        alt="Never gonna let you down"
        src="https://lh6.googleusercontent.com/OsYIg4LrfmRyYiUa2RvXn5BqhpeA5B2EK7-MRjND8npSdopFZ3shsDPN9ZGe107Pl8FQx7elYcMCEQs6NsW4c5CR8Eq7Lm6f21WdybHWPzuhRYTgt-zBwOtjvemJiBA3tQ=s412"
      />
    </div>
  );
};

export { Chat };
