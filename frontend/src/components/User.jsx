import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box, Button } from '@material-ui/core';
import { api } from '../utils';
import Popup from 'reactjs-popup';
import { UserInfoSheet } from './UserInfoSheet';
import { Session } from '../App';
import standardRank from '../img/rank1.svg';
import helperRank from '../img/rank2.svg';
import modRank from '../img/mod.svg';
import adminRank from '../img/admin.svg';

const useStyles = makeStyles(theme => ({
  container: { height: '10%', width: '200px' },
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

function User(props) {
  const classes = useStyles();
  const [user, setUser] = React.useState([]);
  const [badge, setBadge] = React.useState('');
  const username = props.username;
  const session = React.useContext(Session);

  React.useEffect(() => {
    getUserInfo(username).then(resp => {
      console.log(resp);
      setUser(resp);
      if (resp.rank === 1) setBadge(adminRank);
      else if (resp.rank === 2) setBadge(modRank);
      else if (resp.rank === 3) setBadge(standardRank);
    });
  }, []);

  return (
    <Popup
      key={username}
      trigger={
        <Button classes={{ root: classes.userButton }} key={username}>
          <img
            style={{ float: 'left' }}
            src={badge}
            height="30em"
            width="30em"
            alt="loading..."
          />
          <Box mx={1}>
            {username} {username === session.user.id ? ' (You)' : ''}
          </Box>
        </Button>
      }
      position="bottom center"
      closeOnDocumentClick
    >
      <UserInfoSheet key={username} user={user} />
    </Popup>
    /*
    <div className={classes.container}>
      <img
        style={{ float: 'left' }}
        src={badge}
        height="30em"
        width="30em"
        alt="loading..."
      />
      <Typography font-size="1em" style={{ float: 'left' }}>
        {user ? username : ' loading...'}
      </Typography>
    </div>
    */
  );
}

export { User };
