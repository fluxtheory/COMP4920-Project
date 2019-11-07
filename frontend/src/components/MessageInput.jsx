import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Session } from '../App';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Button, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  MessageInputContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  inputField: {
    width: '30%',
    left: '2%',
  },
  inputSubmit: {
    left: '34%',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function MessageInput(props) {
  const classes = useStyles();
  const session = React.useContext(Session);
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

  const handleSubmit = e => {
    e.preventDefault();
  };

  const handleChange = event => {
    setMessage(event.target.value);
  };

  return (
    <div className={classes.MessageInputContainer}>
      <Paper className={classes.root}>
        <form onSubmit={handleSubmit}>
          <div className={classes.inputField}>
            <TextField
              type="text"
              margin="normal"
              variant="outlined"
              onChange={handleChange}
              value={message}
            />
          </div>
          <div className={classes.inputSubmit}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              onClick={handleClick}
            >
              Send Message
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}

export { MessageInput };
