import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TextField, Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { CurrentUser } from '../App';

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

function LoginBox() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    nameOrEmail: '',
    password: '',
  });
  const currUser = useContext(CurrentUser);

  const [loginHelpString, setLoginHelpString] = React.useState('');
  const [loginSuccess, setLoginSuccess] = React.useState(false);

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
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        if (json.success === true) {
          currUser.updateCurrentUser({
            username: json.username,
            admin: json.isAdmin,
          });
          localStorage.setItem('userToken', json.token);
          setLoginSuccess(true);
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
    return <Redirect to="/kudo/dashboard" />;
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
