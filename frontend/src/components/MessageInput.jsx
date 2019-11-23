import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Session } from '../App';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Button, TextField, Input, Box } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  MessageInputContainer: {},
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '7vh',
  },
  inputSubmit: {
    left: '34%',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
  messageInput: {
    borderRadius: '12px',
    // border: '1px solid',
    background: '#f5f5f5',
    margin: '0 20px',
    width: '100%',
    height: '70%',
  },
}));

function MessageInput(props) {
  const classes = useStyles();
  const session = React.useContext(Session);
  const roomId = props.roomId;
  const [message, setMessage] = React.useState('');

  const handleClick = async event => {};

  const handleEnter = async event => {
    if (event.key !== 'Enter') return;
    if (message === '') return;
    // props.onMessageSend(message);
    try {
      await session.user.sendSimpleMessage({
        text: message,
        roomId: roomId,
      });
    } catch (err) {
      throw Error(`Sending message via Chatkit fucked up: ${err}`);
    } finally {
      setMessage('');
    }
  };

  const handleChange = event => {
    setMessage(event.target.value);
  };

  return (
    <div className={classes.inputContainer}>
      <Box
        display="flex"
        alignItems="center"
        padding={1}
        paddingX={3}
        className={classes.messageInput}
      >
        <Input
          onChange={handleChange}
          onKeyDown={handleEnter}
          value={message}
          placeholder="'Learning is best done in communities' - Jordan Isakka"
          fullWidth
        />
      </Box>
      {/*       <Paper className={classes.root}>
        <form onSubmit={handleSubmit}>
          <div className={classes.inputContainer}></div>
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
      </Paper> */}
    </div>
  );
}

export { MessageInput };
