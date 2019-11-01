import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TextField, Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import { Chatkit } from '../App';


const useStyles = makeStyles(theme => ({
  creationContainer: {
    maxWidth: '1000px',
    margin: '200px',
  },
  textFieldContainer: {
    margin: '0 10px 10px 10px',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400,
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

const instanceLocator = 'v1:us1:4c1776d3-a51e-497e-8f3e-0a9f08eabf77';
const tokenProvider = new TokenProvider({
  url:
    'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/4c1776d3-a51e-497e-8f3e-0a9f08eabf77/token',
});

function LoginBox() {
  const classes = useStyles();
  const chatkit = React.useContext(Chatkit);
  const [values, setValues] = React.useState({
    nameOrEmail: '',
    password: '',
  });


  const [loginHelpString, setLoginHelpString] = React.useState('');
  const [loginSuccess, setLoginSuccess] = React.useState(false);
  const [username, setusername] = React.useState('');

  React.useEffect(() => {
    if (!username) return;
    const chatManager = new ChatManager({
      instanceLocator: instanceLocator,
      userId: username,
      tokenProvider,
    });

    chatManager
      .connect()
      .then(currentUser => {
        console.log('Successful connection', currentUser);
        chatkit.updateUser(currentUser);
        setLoginSuccess(true);
      })
      .catch(err => {
        console.log('Error on connection', err);
      });
  }, [username]);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = e => {
    sendPostValues();
    e.preventDefault();
  };

  const sendPostValues = () => {
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3001/login';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        if (json.success === true) {
          localStorage.setItem('userToken', json.token);
          setusername(json.username);
        } else {
          setLoginHelpString(json.error);
        }
      }
    };
    var data = JSON.stringify({
      nameOrEmail: values.nameOrEmail,
      password: values.password,
    });
    xhr.send(data);
  };

  if (loginSuccess === true) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className={classes.creationContainer}>
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3">
          Enter your details:
        </Typography>
        <form onSubmit={e => handleSubmit(e)}>
          <div className={classes.textFieldContainer}>
            <TextField
              id="nameOrEmail"
              label="Username/Email"
              className={classes.textField}
              value={values.nameOrEmail}
              onChange={handleChange('nameOrEmail')}
              margin="normal"
              type="text"
              placeholder="jonsnow420blazeit@unsw.edu.au"
              autoComplete="off"
              required
            />
            <Typography variant="subtitle1">{loginHelpString}</Typography>
          </div>
          <div className={classes.textFieldContainer}>
            <TextField
              id="password"
              label="Password"
              className={classes.textField}
              value={values.password}
              onChange={handleChange('password')}
              margin="normal"
              type="password"
              placeholder=""
              required
            />
          </div>
          <div align="right">
            <Button type="submit">Submit</Button>
          </div>
        </form>
        <Typography>
          Don't have an account?{' '}
          <a href="createAccount">Create an account here</a>.
        </Typography>
      </Paper>
    </div>
  );
}

export { LoginBox };
