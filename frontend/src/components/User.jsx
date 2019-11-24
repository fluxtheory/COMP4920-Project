import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box, Button } from '@material-ui/core';
import { api } from '../utils';
import Popup from 'reactjs-popup';
import { UserInfoSheet } from './UserInfoSheet';
import { Session } from '../App';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import helpfulRank from '../img/rank1.svg';
import respectedRank from '../img/rank2.svg';
import honouredRank from '../img/rank3.svg';
import modRank from '../img/mod.svg';
import adminRank from '../img/admin.svg';
import { useRouteMatch, Link, useParams } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  container: { height: '10%', width: '200px' },
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
      let rank = resp.rank;
      if (rank == 1) setBadge(adminRank);
      else if (rank == 2) setBadge(modRank);
      else if (rank == 3) {
        if (resp.karma >= 50) setBadge(honouredRank);
        else if (resp.karma >= 25) setBadge(respectedRank);
        else if (resp.karma >= 10) setBadge(helpfulRank);
        else setBadge('');
      } else setBadge('');
    });
  }, []);

  return (
    <Popup
      key={username}
      trigger={
        <Button
          classes={{ root: classes.userButton }}
          component={Link}
          to={'/kudo/' + useParams().course + '/chat/' + username}
          key={username}
        >
          {badge === '' ? (
            <ChildCareIcon />
          ) : (
            <img
              style={{ float: 'left' }}
              src={badge}
              height="30em"
              width="30em"
            />
          )}
          <Box mx={1}>
            {username} {username === session.user.id ? ' (You)' : ''}
          </Box>
        </Button>
      }
      position="left centre"
      on="hover"
      closeOnDocumentClick
    >
      <UserInfoSheet key={username} username={username} />
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
