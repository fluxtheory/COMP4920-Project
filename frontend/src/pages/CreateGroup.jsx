import React, { useState, useEffect, useContext } from 'react';
import { Amazing } from '../components/Amazing';
import {
  makeStyles,
  Typography,
  TextField,
  Button,
  Box,
} from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import { api } from '../utils';
import { Session } from '../App';
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
// two forms: 1. title submit. 2.each user submit

// top level comp checks if title submitted, if when not
// display title form with user form disabled/greyed out

// User enters title -> Enter
// Submits to backend
// Backend creates chatkit group
// On success response
// Input becomes title
// Second form become active
// User searches for user in course -> Enter
// Submits to backend
// Backend adds that user to group

// see what backend requires
// Dummy title trypography
// input wraps typography
// wrap in form

const useUsername = () => {
  const session = useContext(Session);
  const username = session.user.id;
  return username;
};

const makeGroupId = (groupName, course) => {
  return `__${course}_group__${groupName}`;
};

const TitleForm = ({
  onSuccess: handleSuccess,
  onTitleChange: handleChange,
  titleValue: titleInput,
}) => {
  const { params } = useRouteMatch('/kudo/:course/group/create');
  const classes = useStyles();
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  // const [titleInput, setTitleInput] = useState('');
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
        console.log('Absolute something');
        handleSuccess();
        setSuccess(true);
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
    */
  }, [submitted]);

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

const GroupTitle = ({ text }) => <Typography variant="h1">{text}</Typography>;

const CreateGroup = () => {
  const classes = useStyles();
  // MRTODO: make current course in context? or `useCourse` hook, replace all usages of it
  const { params } = useRouteMatch('/kudo/:course');
  const [groupCreated, setGroupCreated] = useState(false);
  const [titleInput, setTitleInput] = useState('');

  const handleUserAdd = username => {
    api
      // MRTODO: remove hard coded group
      .post(`/${params.course}/group/add`, { group_name: 'Supatest', username })
      .then(res => {
        console.log('Adding group member success. response: ', res);
      })
      .catch(err => {
        console.log('Error adding group member: ', err.message);
      });
  };

  const titleFlow = groupCreated ? (
    <GroupTitle text={titleInput} />
  ) : (
    <TitleForm
      onTitleChange={event => setTitleInput(event.target.value)}
      onSuccess={() => setGroupCreated(true)}
      titleValue={titleInput}
    />
  );

  return (
    <div className={classes.createGroupPageContainer}>
      {titleFlow}
      <Typography variant="h4">Add users:</Typography>
      {/* MRTODO rename to AddUserForm */}
      <UserSearchForm onUserAdd={handleUserAdd} />
    </div>
  );
  // return <h1>{`I'm create group chat for course: ${params.course} `}</h1>;
};

// MRTODO: very mrtodo
const UserSearchForm = ({ onUserAdd }) => {
  const classes = useStyles();

  const { params } = useRouteMatch('/kudo/:course');
  const course = params.course;
  const [users, setUsers] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [currSelected, setCurrSelected] = React.useState([]);
  // const [userInput, setUserInput] = React.useState('');

  console.log('Add group members:');
  console.log('Current');
  console.log(currSelected);
  console.log('All selected');
  console.log(selected);
  const handleChange = (event, value) => {
    console.log('Add group members handle chnage');
    console.log(event);
    console.log(value);
    if (!value) {
      onUserAdd(currSelected);
      selected.push(currSelected);
      setSelected([...selected]);
      return setCurrSelected('');
    }
    setCurrSelected(value.username);
  };

  React.useEffect(() => {
    const prom = getAllUsers(course).then(resp => {
      setUsers(resp);
    });
  }, [course]);

  const handleSubmit = e => {
    e.preventDefault();
  };

  // const handleChange = (event, value) => {
  //   if (!value) return setUserInput('');
  //   setUserInput(value);
  // };

  return (
    <div className={classes.addUserContainer}>
      <div className={classes.userListContainer}>
        {selected.map(u => {
          return (
            <Button classes={{ root: classes.userButton }} key={u}>
              <ChildCareIcon />
              <Box mx={1}>{u}</Box>
            </Button>
          );
        })}
      </div>
      <form onSubmit={handleSubmit}>
        <Autocomplete
          options={users}
          // getOptionLabel={option => option.username}
          // MRTODO: figure out why option is null on submit
          getOptionLabel={option =>
            (option && option.username) || `Weird option value: ${option}`
          }
          onChange={handleChange}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Search for user..."
              value={currSelected}
              fullWidth
            />
          )}
        />
        {/* MRTODO: make every 'Enter' of a user fire a backend request */}
        <Button color="primary" className={classes.button}>
          <Box fontSize={20}>Create Group!</Box>
        </Button>
      </form>
    </div>
  );
};

const getAllUsers = function(course) {
  return new Promise((resolve, reject) => {
    api
      .get('/' + course + '/users')
      .then(resp => {
        console.log(resp.data);
        resolve(resp.data);
      })
      .catch(err => {
        console.log(err);
        reject([]);
      });
  });
};
export { CreateGroup };
