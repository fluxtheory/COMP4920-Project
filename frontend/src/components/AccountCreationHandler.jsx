import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TextField, Button } from '@material-ui/core';

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

function AccountCreationHandler() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const [emailHelpString, setEmailHelpString] = React.useState('');
  const [passwordHelpString, setPasswordHelpString] = React.useState('');

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = e => {
    let emailCheckPassed = checkEmailField();
    let passwordCheckPassed = checkPasswordField();

    if (emailCheckPassed !== true || passwordCheckPassed !== true) {
      e.preventDefault();
    }
  };

  const checkPasswordField = () => {
    let ret = true;
    setPasswordHelpString('');

    if (values.password !== values.password2) {
      setPasswordHelpString('Passwords do not match!');
      ret = false;
    }

    if (values.password.length < 6) {
      setPasswordHelpString('Password must be at least six chars long.');
      ret = false;
    }

    return ret;
  };

  const checkEmailField = () => {
    let ret = true;
    setEmailHelpString('');

    if (
      !values.email.includes('@unsw.edu.au') &&
      !values.email.includes('@ad.unsw.edu.au')
    ) {
      setEmailHelpString('Please use your UNSW email.');
      ret = false;
    }

    return ret;
  };

  return (
    <div className={classes.creationContainer}>
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3">
          Enter your details:
        </Typography>
        <form onSubmit={e => handleSubmit(e)}>
          <div className={classes.textFieldContainer}>
            <TextField
              id="name"
              label="Name"
              className={classes.textField}
              value={values.name}
              onChange={handleChange('name')}
              margin="normal"
              type="text"
              placeholder="aashwin"
              autoComplete="off"
              required
            />
          </div>
          <div className={classes.textFieldContainer}>
            <TextField
              id="email"
              label="Email"
              className={classes.textField}
              value={values.email}
              onChange={handleChange('email')}
              margin="normal"
              type="email"
              placeholder="jonsnow420blazeit@unsw.edu.au"
              autoComplete="off"
              required
            />
            <Typography variant="subtitle1">{emailHelpString}</Typography>
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
            <Typography variant="subtitle1">{passwordHelpString}</Typography>
          </div>
          <div className={classes.textFieldContainer}>
            <TextField
              id="password2"
              label="Password (Confirm)"
              className={classes.textField}
              value={values.password2}
              onChange={handleChange('password2')}
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
          Already have an account? <a href="/login">Sign In</a>.
        </Typography>
      </Paper>
    </div>
  );
}

export { AccountCreationHandler };
