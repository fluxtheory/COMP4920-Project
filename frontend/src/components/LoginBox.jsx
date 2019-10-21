import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TextField, Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

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
    var url = 'http://localhost:3001/api/users/login';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        if (json.success === true) {
          setLoginSuccess(true);
        } else {
          setLoginHelpString('Invalid email/password.');
        }
      }
    };
    var json = {};
    if (values.nameOrEmail.includes('@')) {
      json = {
        email: values.nameOrEmail,
        password: values.password,
      };
    } else {
      json = {
        name: values.nameOrEmail,
        password: values.password,
      };
    }
    var data = JSON.stringify(json);
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
