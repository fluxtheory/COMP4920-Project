import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography, Box, Divider } from '@material-ui/core';
import { Session } from '../App';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import { useUsername } from '../utils';
import { UserNewBadge } from './User';

const useStyles = makeStyles(theme => ({
  messageContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
  },
  messageHull: {
    display: 'flex',
    flexDirection: 'column',
  },

  userBadge: {
    fontSize: '3rem',
    margin: '0 20px',
  },

  othersUsername: {
    right: '1%',
    color: 'blue',
  },
  msgUsername: {
    fontWeight: 'bold',
  },
  messageDefault: {},
  messageWithMention: {
    // color: 'red',
    // backgroundColor: '#FFFF00',
    border: props => (props.isUserMention ? '2px solid gold' : null),
    borderRadius: props => (props.isUserMention ? '3px' : null),
    background: props => (props.isUserMention ? '#ffd7002e' : null),
  },
  root: {
    padding: theme.spacing(3, 2),
    background: theme.palette.background.level1,
  },
}));

// #SUBMISSION: change to actual badges
export const UserBadge = ({ className }) => {
  const classes = useStyles();
  return (
    <ChildCareIcon
      className={className || classes.userBadge}
      fontSize="large"
    />
  );
};

const MessageHull = ({ message }) => {
  const classes = useStyles();

  const username = useUsername();
  const msgUsername = message.senderId;
  const ownUser = msgUsername === username;
  const textContent = message.parts[0].payload.content;

  const usernameStyles = {
    color: ownUser ? '#880000' : '#585858',
  };

  return (
    <div className={classes.messageHull}>
      {/* <Box color={!ownUser ? '#585858' : '#880000'}> */}
      <Box {...usernameStyles}>
        <Typography variant="subtitle1" className={classes.msgUsername}>
          {msgUsername}
        </Typography>
      </Box>
      <Typography>{textContent}</Typography>
    </div>
  );
};

function Message({ msg }) {
  const username = useUsername();
  const textContent = msg.parts[0].payload.content;
  const msgUsername = msg.senderId;
  const isUserMention = textContent.includes(`@${username}`);
  const classes = useStyles({ isUserMention });

  const userMentionStyles = {
    border: isUserMention ? '2px solid gold' : null,
    borderRadius: isUserMention ? '3px' : null,
    background: isUserMention ? '#ffd7002e' : null,
  };

  return (
    <Box style={{ ...userMentionStyles }}>
      {/* <Box className={classes.messageWithMention}> */}
      <div className={classes.messageContainer}>
        <Box mr={3}>
          <UserNewBadge username={msgUsername} />
        </Box>
        <MessageHull message={msg} />
        {/* <Paper className={classes.root}>
        <div
          className={
            username === session.user.id
              ? classes.messageFromSelf
              : classes.messageFromOther
          }
        >
          <Typography variant="h5" component="h3">
            <Box fontWeight="fontWeightBold">{username}</Box>
            <Box>
              {' - ' +
                new Date(props.msg.createdAt)
                  .toString()
                  .split(' ')
                  .slice(0, 5)
                  .join(' ')}
            </Box>
          </Typography>
          <Typography>
            -----------------------------------------------------
          </Typography>
          <Typography
            className={
              textContent.includes('@' + session.user.id)
                ? classes.messageWithMention
                : classes.messageDefault
            }
            component="p"
          >
            {textContent}
          </Typography>
        </div>
      </Paper> */}
      </div>
      <Divider />
    </Box>
  );
}

export { Message };
