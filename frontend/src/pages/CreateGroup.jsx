import React, { useState, useEffect, useContext } from 'react';
import { Amazing } from '../components/Amazing';
import {
  makeStyles,
  Typography,
  TextField,
  Button,
  Box,
} from '@material-ui/core';
import { useRouteMatch, Redirect } from 'react-router-dom';
import { api, useUsername } from '../utils';
import { Session, NewGroupTrigger } from '../App';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  titleInput: {
    fontSize: '3rem',
  },
  createGroupPageContainer: {
    margin: '2rem',
  },
  addUserContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',

    margin: '1rem 0',
    height: '100%',
  },
}));

const TitleForm = ({
  onSuccess: handleSuccess,
  onTitleChange: handleChange,
  titleValue: titleInput,
}) => {
  const { params } = useRouteMatch('/kudo/:course/group/create');
  const classes = useStyles();
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const groupTrigger = useContext(NewGroupTrigger);
  const username = useUsername();

  useEffect(() => {
    if (!submitted) return;

    // TODO: client error messages!
    api
      .post(`/${params.course}/group`, {
        username,
        group_name: titleInput,
      })
      .then(res => {
        handleSuccess();
        setSuccess(true);
        groupTrigger.trigger();
      })
      .catch(err => {
        console.log(`Error creating group: ${err.message}`);
      })
      .finally(() => {
        setSubmitted(false);
      });
      /*    
     handleSuccess();
    setSuccess(true);
    setSubmitted(false); 
    */}, [submitted]);

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          className={classes.titleInput}
          InputProps={{ classes: { input: classes.titleInput } }}
          label="Group Name"
          margin="normal"
          onChange={handleChange}
        />
      </form>
    </div>
  );
};

const CreateGroup = () => {
  const classes = useStyles();
  const { params } = useRouteMatch('/kudo/:course');
  const [groupCreated, setGroupCreated] = useState(false);
  const [titleInput, setTitleInput] = useState('');

  const titleFlow = groupCreated ? (
    <Redirect to={`/kudo/${params.course}/group/${titleInput}/settings`} />
  ) : (
    <TitleForm
      onTitleChange={event => setTitleInput(event.target.value)}
      onSuccess={() => setGroupCreated(true)}
      titleValue={titleInput}
    />
  );

  return <div className={classes.createGroupPageContainer}>{titleFlow}</div>;
};

export { CreateGroup };
