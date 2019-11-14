import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography, Box } from '@material-ui/core';
import { Session } from '../App';

const useStyles = makeStyles(theme => ({
  messageContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  messageFromOther: {
    right: '1%',
    color: 'blue',
  },
  messageFromSelf: {
    left: '1%',
    color: 'green',
  },
  messageDefault: {},
  messageWithMention: {
    color: 'red',
    backgroundColor: '#FFFF00',
  },
  root: {
    padding: theme.spacing(3, 2),
    background: 'silver',
  },
}));

function Message(props) {
  const classes = useStyles();

  const username = props.msg.senderId;
  const textContent = props.msg.parts[0].payload.content;
  const session = React.useContext(Session);

  return (
    <div className={classes.messageContainer}>
      <Paper className={classes.root}>
        <div
          className={
            username === session.user.id
              ? classes.messageFromSelf
              : classes.messageFromOther
          }
        >
          <Typography variant="h5" component="h3">
            <Box fontWeight="fontWeightBold">{username}</Box>
            <Box>{' - ' + props.msg.createdAt}</Box>
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
      </Paper>
    </div>
  );
}

export { Message };
