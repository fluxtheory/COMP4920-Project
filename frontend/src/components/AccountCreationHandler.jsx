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
    email: '',
    password: '',
    passwordRepeat: '',
    passwordsMatch: false,
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <div className={classes.creationContainer}>
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3">
          Enter your details:
        </Typography>
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
          />
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
          />
        </div>
        <div className={classes.textFieldContainer}>
          <TextField
            id="passwordRepeat"
            label="Password (Confirm)"
            className={classes.textField}
            value={values.passwordRepeat}
            onChange={handleChange('passwordRepeat')}
            margin="normal"
            type="password"
            placeholder=""
          />
        </div>
        <div align="right">
          <Button value="Submit">Submit</Button>
        </div>
      </Paper>
    </div>
  );
}

export { AccountCreationHandler };
