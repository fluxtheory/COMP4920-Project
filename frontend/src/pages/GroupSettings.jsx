import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Box, Typography, TextField, Button, Divider } from '@material-ui/core';
import { api } from '../utils';
import { Autocomplete } from '@material-ui/lab';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { useUsername } from './CreateGroup';

const useStyles = makeStyles(theme => ({
  addUserContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',

    margin: '0',
    flexGrow: '1',
  },
  groupMemberContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  groupSettingsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',

    padding: '1rem',
    paddingBottom: '0',
    height: '100%',
  },
  groupMembersTitle: {
    margin: '1.5rem 0',
  },
}));

const GroupTitle = ({ text }) => <Typography variant="h1">{text}</Typography>;

export const GroupSettings = () => {
  const classes = useStyles();
  const { params } = useRouteMatch('/kudo/:course/group/:group/settings');
  const handleUserAdd = username => {
    api
      .post(`/${params.course}/group/add`, {
        group_name: params.group,
        username,
      })
      .then(res => {
        console.log('Adding group member success. response: ', res);
      })
      .catch(err => {
        console.log('Error adding group member: ', err.message);
      });
  };
  return (
    <div className={classes.groupSettingsContainer}>
      <div>
        <GroupTitle text={params.group} />
        <Divider />
      </div>
      <Typography variant="h4" className={classes.groupMembersTitle}>
        Group Members:
      </Typography>
      <UserSearchForm onUserAdd={handleUserAdd} />
    </div>
  );
};

const GroupMember = props => {
  const classes = useStyles();
  const { params } = useRouteMatch('/kudo/:course/group/:group');
  const username = useUsername();

  // const handleRemove = () => {
  //   api
  //     .post(
  //       `/${params.course}/group/remove`,
  //       { username, group_name: params.group },
  //       { params: { course: params.course } }
  //     )
  //     .then(res => {
  //       console.log('GroupMember: remove success', res);
  //     })
  //     .catch(err => {
  //       console.log('GroupMember: remove fail', err.message);
  //     });
  // };

  return (
    <div className={classes.groupMemberContainer}>
      <Button classes={{ root: classes.userButton }} key={props.user}>
        <ChildCareIcon />
        <Box mx={1}>{props.user}</Box>
      </Button>
    </div>
  );
};

// MRTODO: very mrtodo
const UserSearchForm = ({ onUserAdd }) => {
  const classes = useStyles();
  const { params } = useRouteMatch('/kudo/:course/group/:group/settings');
  const course = params.course;
  const [users, setUsers] = React.useState([]);
  const [groupMembers, setGroupMembers] = React.useState([]);
  const [currSelected, setCurrSelected] = React.useState([]);

  useEffect(() => {
    api
      .get(`/${params.course}/group-users`, { params: { group: params.group } })
      .then(res => {
        console.log('GroupSettings: members fetch success', res);

        const members = res.data.map(u => u.username);
        setGroupMembers([...members]);
      })
      .catch(err => {
        console.log('GroupSettings: members fetch fail', err);
      });
  }, [params.group, params.course]);

  const handleChange = (event, value) => {
    if (!value) {
      onUserAdd(currSelected);
      groupMembers.push(currSelected);
      setGroupMembers([...groupMembers]);
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
  const groupMembersElements = groupMembers.map(u => {
    return <GroupMember key={u} user={u} />;
  });
  return (
    <div className={classes.addUserContainer}>
      <div className={classes.userListContainer}>{groupMembersElements}</div>
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
      </form>
    </div>
  );
};

// Looks like
// username to left
// 'x' to the right
//

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
