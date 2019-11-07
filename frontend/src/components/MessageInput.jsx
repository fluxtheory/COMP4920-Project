import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Session } from '../App';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  MessageInputContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function MessageInput(props) {
  const classes = useStyles();
  const session = React.useContext(session);
  const roomId = props.roomId;
  const [message, setMessage] = React.useState('');

  const handleClick = async event => {
    try {
      setMessage('');
      await session.user.sendSimpleMessage({
        text: message,
        roomId: roomId,
      });
    } catch (err) {
      throw Error(`Sending message via Chatkit fucked up: ${err}`);
    } finally {
    }
  };

  const handleChange = event => {
    setMessage(event.target.value);
  };

  return (
    <div className={classes.MessageInputContainer}>
      <Paper className={classes.root}>
        <input type="text" onChange={handleChange} value={message} />
        <button onClick={handleClick}>Send a message!</button>
      </Paper>
    </div>
  );
}

export { MessageInput };
