import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  messageContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  messageFromOther: {
    right: '1%',
    color: 'blue'
  },
  messageFromSelf: {
    left: '1%',
    color: 'green'
  },
  messageDefault: {
  },
  messageWithMention: {
    color: 'yellow',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function Message(props) {
  const classes = useStyles();

  const username = props.msg.senderId;
  const textContent = props.msg.parts[0].payload.content;

  return (
    <div className={classes.messageContainer}>
      <Paper className={classes.root}>
      <div className={username === localStorage.getItem('username') ? classes.messageFromSelf:classes.messageFromOther}>
        <Typography variant="h5" component="h3">
          {username}
        </Typography>
        {console.log(textContent)}
        <Typography className={textContent.includes('@'+username) ? classes.messageWithMention:classes.messageDefault}component="p">{textContent}</Typography>
        </div>
      </Paper>
    </div>
  );
}

export { Message };
