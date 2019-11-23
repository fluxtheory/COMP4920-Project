import React, { useContext } from 'react';
import { Box, Typography } from '@material-ui/core';
import { UserBadge } from '../components/Message';
import { useUsername } from '../utils';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import { Session } from '../App';

export const useStyles = makeStyles(theme => ({
  userBadge: {
    fontSize: '2rem',
    margin: '0 10px',
  },
}));

// #SUBMISSION put in kudos here as well
export const UserAccountBox = () => {
  const username = useUsername();
  const classes = useStyles();
  const session = useContext(Session);
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      color="#f5f5f5"
      bgcolor="hsla(231, 42%, 39%, 1)"
      paddingX={2}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        color="#f5f5f5"
        bgcolor="hsla(231, 42%, 39%, 1)"
      >
        <UserBadge className={classes.userBadge} />
        <Typography variant="h6">{username}</Typography>
      </Box>
      <Box component={Link} to="/login" color="#f5f5f5">
        <MeetingRoomIcon
          onClick={e => {
            localStorage.removeItem('userToken');
            session.updateUser(null);
          }}
        />
      </Box>
    </Box>
  );
};
