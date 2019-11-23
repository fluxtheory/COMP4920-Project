import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useRouteMatch, Link } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core/';
import { Typography, Box } from '@material-ui/core';
import { UserUpvoteButton } from './UserUpvoteButton';
import { api } from './../utils';

const useStyles = makeStyles(theme => ({
  UserInfoSheetContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

const getUserInfo = function(username) {
  return new Promise((resolve, reject) => {
    api
      .post('/user', { usernames: [username] })
      .then(resp => {
        console.log(resp);
        if (resp.statusText === 'OK') resolve(resp.data[0]);
        else resolve({});
      })
      .catch(err => {
        console.log(err);
        reject([]);
      });
  });
};

function UserInfoSheet(props) {
  const classes = useStyles();
  const username = props.user.username;
  const [kudos, setKudos] = React.useState(0);
  const [rank, setRank] = React.useState('pleb');

  React.useEffect(() => {
    const prom = getUserInfo(username).then(resp => {
      console.log(resp);
      setKudos(resp.karma);
      let r = '';
      if (resp.rank === 1) r = 'Administrator';
      else if (resp.rank === 2) r = 'Moderator';
      else r = 'Student';
      setRank(r);
    });
  }, [username]);

  return (
    <div className={classes.UserInfoSheetContainer}>
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3">
          {username}
        </Typography>
        <Button
          classes={{ root: classes.userButton }}
          key={username}
          component={Link}
          to={'/kudo/' + username + '/dm'}
        >
          <Box mx={1}>Message</Box>
        </Button>
        <UserUpvoteButton
          username={username}
          kudos={kudos}
          setKudos={setKudos}
        />
        <Typography variant="h5" component="h3">
          {kudos + ' Karma'}
        </Typography>
        <Typography variant="h5" component="h3">
          {'Rank: ' + rank}
        </Typography>
      </Paper>
    </div>
  );
}

export { UserInfoSheet };
