import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import { TextField, Button } from '@material-ui/core/';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { api } from './../utils';
import { Session } from './../App';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  UserUpvoteButtonContainer: {},
  root: {},
}));

const checkKarmaStatus = function(user, giver_username) {
  return new Promise((resolve, reject) => {
    api
      .post('/' + user + '/checkKarma', {
        giver_username,
      })
      .then(resp => {
        console.log(resp);
        resolve(resp.data.data);
      })
      .catch(err => {
        console.log(err);
        reject(false);
      });
  });
};

function UserUpvoteButton(props) {
  const classes = useStyles();
  const [karmaStatus, setKarmaStatus] = React.useState(false);
  const session = React.useContext(Session);
  let kudos = props.kudos;
  const username = props.username;
  const setKudos = props.setKudos;

  React.useEffect(() => {
    const prom = checkKarmaStatus(username, session.user.id).then(resp => {
      console.log(resp);
      setKarmaStatus(resp);
    });
  }, [username]);

  const onVote = e => {
    api
      .post('/' + username + '/karma', {
        giver_username: session.user.id,
      })
      .then(resp => {
        if (karmaStatus) setKudos(kudos - 1);
        else setKudos(kudos + 1);
        setKarmaStatus(!karmaStatus);
      });
  };
  return (
    <div className={classes.UserUpvoteButtonContainer}>
      <Button
        onClick={() => {
          onVote();
        }}
        className={classes.UserUpvoteButton}
        disabled={username === session.user.id}
      >
        {karmaStatus ? (
          <StarRoundedIcon color="secondary" />
        ) : (
          <StarBorderRoundedIcon
            color={username === session.user.id ? 'error' : 'primary'}
          />
        )}
      </Button>
    </div>
  );
}

export { UserUpvoteButton };
