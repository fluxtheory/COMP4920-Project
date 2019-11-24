import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useRouteMatch, Link, useParams } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core/';
import { Typography, Box } from '@material-ui/core';
import { UserUpvoteButton } from './UserUpvoteButton';
import { api } from './../utils';
import ChatBubbleTwoToneIcon from '@material-ui/icons/ChatBubbleTwoTone';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
  nameContainer: {
    position: 'relative',
    top: '2%',
    left: '1%',
  },
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
  const username = props.username;
  const [kudos, setKudos] = React.useState(0);
  const [rank, setRank] = React.useState('Student');

  React.useEffect(() => {
    const prom = getUserInfo(username).then(resp => {
      setKudos(resp.karma);
      let r = '';
      if (resp.rank === 1) r = 'Moderator';
      else if (resp.rank === 2) r = 'Helper';
      else r = 'Student';
      setRank(r);
    });
  }, [username]);

  return (
    <div className={classes.UserInfoSheetContainer}>
      <Paper className={classes.root}>
        <div className={classes.nameContainer}>
          <Typography variant="h5" component="h3">
            {username}
          </Typography>
        </div>
        <Divider />
        <Typography variant="h5" component="h3">
          {kudos + ' Karma'}
        </Typography>
        <Divider />
        <Typography variant="h5" component="h3">
          {rank}
        </Typography>
        <Divider />
        <Button
          classes={{ root: classes.userButton }}
          key={username}
          component={Link}
          to={'/kudo/' + useParams().course + '/chat/' + username}
        >
          <Box mx={1}>
            Message <ChatBubbleTwoToneIcon />
          </Box>
        </Button>
        <UserUpvoteButton
          username={username}
          kudos={kudos}
          setKudos={setKudos}
        />
      </Paper>
    </div>
  );
}

export { UserInfoSheet };
