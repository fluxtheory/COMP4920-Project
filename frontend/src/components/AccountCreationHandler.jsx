import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TextField, Button, Checkbox, Box } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  creationContainer: {
    maxWidth: '1000px',
    minWidth: '500px',
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
    opacity: '0.85',
  },
}));

function AccountCreationHandler() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    name: '',
    email: '',
    zid: '',
    password: '',
    password2: '',
    admin: false,
  });

  const [nameHelpString, setNameHelpString] = React.useState('');
  const [emailHelpString, setEmailHelpString] = React.useState('');
  const [passwordHelpString, setPasswordHelpString] = React.useState('');
  const [registrationSuccess, setRegistrationSuccess] = React.useState(false);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleAdminCheck = event => {
    setValues({ ...values, admin: event.target.checked });
  };

  const handleSubmit = e => {
    setNameHelpString('');
    setEmailHelpString('');
    setPasswordHelpString('');

    let emailCheckPassed = checkEmailField();
    let passwordCheckPassed = checkPasswordField();

    if (emailCheckPassed === true && passwordCheckPassed === true) {
      sendPostValues();
    }

    e.preventDefault();
  };

  /**
   * Client-side check if the password fields match.
   */
  const checkPasswordField = () => {
    let ret = true;

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

  /**
   * Client-side check that the email is for a UNSW student.
   * Added for user convenience.
   */
  const checkEmailField = () => {
    let ret = true;

    if (
      !values.email.includes('@unsw.edu.au') &&
      !values.email.includes('@ad.unsw.edu.au')
    ) {
      setEmailHelpString('Please use your UNSW email.');
      ret = false;
    }

    return ret;
  };

  const sendPostValues = () => {
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3001/register';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var json = JSON.parse(xhr.responseText);
        if (json.success === true) {
          setRegistrationSuccess(true);
        } else {
          console.log(json);
          setNameHelpString(json.error);
          if (json.msg.includes('email'))
            setEmailHelpString('Email is already in use.');
          if (json.msg.includes('username'))
            setNameHelpString('Username is already in use.');
        }
      }
    };
    var data = JSON.stringify({
      name: values.name,
      email: values.email,
      zid: values.zid,
      password: values.password,
      password2: values.password2,
      admin: values.admin,
    });
    xhr.send(data);
  };

  if (registrationSuccess === true) {
    return <Redirect to="/login" />;
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
              id="name"
              name="name"
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
            <Typography variant="subtitle1">{nameHelpString}</Typography>
          </div>
          <div className={classes.textFieldContainer}>
            <TextField
              id="email"
              name="email"
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
              id="zid"
              name="zid"
              label="zid"
              className={classes.textField}
              value={values.zid}
              onChange={handleChange('zid')}
              margin="normal"
              type="text"
              placeholder="z1234567"
              required
            />
          </div>
          <div className={classes.textFieldContainer}>
            <TextField
              id="password"
              name="password"
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
              name="password2"
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
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Checkbox
                checked={values['admin']}
                onChange={handleAdminCheck}
                color="primary"
                inputProps={{
                  'aria-label': 'secondary checkbox',
                }}
              />
              <Typography variant="button">Course Moderator?</Typography>
            </Box>
            <div align="right">
              <Button type="submit">Submit</Button>
            </div>
          </Box>
        </form>
        <Typography>
          Already have an account? <a href="/login">Sign In</a>.
        </Typography>
      </Paper>
    </div>
  );
}

export { AccountCreationHandler };
