import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useRouteMatch, Link } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core/';
import { Typography, Box } from '@material-ui/core';
import { UserUpvoteButton } from './UserUpvoteButton';

const useStyles = makeStyles(theme => ({
  UserInfoSheetContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function UserInfoSheet(props) {
  const classes = useStyles();
  const username = props.user.username;

  return (
    <div className={classes.UserInfoSheetContainer}>
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3">
          {username}
        </Typography>
        <Button
          classes={{ root: classes.userButton }}
          key={username}
          component={Link}
          to={'/kudo/' + username + '/dm'}
        >
          <Box mx={1}>Message</Box>
        </Button>
        {
          //<UserUpvoteButton />
        }
      </Paper>
    </div>
  );
}

export { UserInfoSheet };
