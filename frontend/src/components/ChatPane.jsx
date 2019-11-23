import React, { useEffect, useContext, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { Redirect, useRouteMatch, Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { UserSearchForm } from './course/UserSearchForm';
import { Fab, Button, Box } from '@material-ui/core';
import { Session, NewGroupTrigger } from '../App';
import SettingsIcon from '@material-ui/icons/Settings';
import { flexbox } from '@material-ui/system';
import { api, useCourse } from '../utils';
import { useUsername } from '../pages/CreateGroup';

// MRTODO: this file needs to be better named
// MRTODO: even it's own folder with each subpanel as a component
import { ActiveChats } from './ActiveChats';

const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: '0',
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    // padding: theme.spacing(2),
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}))(MuiExpansionPanelDetails);

const useStyles = makeStyles(theme => ({
  expansionPanel: {
    flexGrow: 1,
    margin: 0,
  },
  paneContainer: {
    display: 'flex',
    flexDirection: 'column',
  },

  groupSubpanelContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  addGroupButton: {
    margin: '0.8rem 0',
  },
  groupListContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '0.2rem',
    justifyContent: 'start',
    alignContent: 'start',
  },

  userButton: {
    justifyContent: 'start',
  },
  groupListingContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

function ChatPane() {
  const [expanded, setExpanded] = React.useState('panel1');
  const classes = useStyles();
  const activeCourse = useCourse();

  const handleChange = panel => (event, newExpanded) => {
    if (expanded === panel) return; // one panel is always open
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className={classes.paneContainer}>
      <ExpansionPanel
        square
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
        classes={{ expanded: classes.expansionPanel }}
        disabled={activeCourse === 'dashboard'}
      >
        <ExpansionPanelSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
        >
          <Typography>Course Peers</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <UserSearchForm />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        square
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
        classes={{ expanded: classes.expansionPanel }}
        disabled={activeCourse === 'dashboard'}
      >
        <ExpansionPanelSummary
          aria-controls="panel2d-content"
          id="panel2d-header"
        >
          <Typography>Active Chats</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ActiveChats />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        square
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
        classes={{ expanded: classes.expansionPanel }}
        disabled={activeCourse === 'dashboard'}
      >
        <ExpansionPanelSummary
          aria-controls="panel3d-content"
          id="panel3d-header"
        >
          <Typography>Groups</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <GroupsSubpanel />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

const GroupsSubpanel = () => {
  const classes = useStyles();
  const [addRequest, setAddRequest] = React.useState(false);
  const { params } = useRouteMatch('/kudo/:course');
  const session = useContext(Session);
  const groupTrigger = useContext(NewGroupTrigger);
  const [groups, setGroups] = useState([]);
  const username = useUsername();

  useEffect(() => {
    // below gets groups from chatkit instead of backend
    // console.log(session.user.rooms);
    // const courseGroups = session.user.rooms
    //   .map(room => room.id)
    //   .filter(room => room.startsWith('__'))
    //   .map(room => room.split('__group__')[1])
    //   .map(room => room.split('|'))
    //   .map(([_, a, b]) => {
    // MRTODO: remove malformed group manes -> no ened to check for 'b'
    //     if (a === params.course && b) return b;
    //   });
    api
      .get(`/${params.course}/group`, { params: { user: username } })
      .then(res => {
        setGroups(res.data.map(group => group.name));
      })
      .catch(err => {
        console.log('GroupsSunpanel: error fetching groups', err.message);
      });
  }, [params.course, groupTrigger.subscription]);
  // MRTODO: find a way to update group list on new group

  useEffect(() => {
    if (addRequest) setAddRequest(false);
  }, [addRequest]);

  const handleClick = () => {
    setAddRequest(true);
  };

  if (addRequest) {
    console.log('adding course!');
    return <Redirect to={`/kudo/${params.course}/group/create`} />;
  }

  // MRTODO: clean
  return (
    <div className={classes.groupSubpanelContainer}>
      <div className={classes.groupListContainer}>
        {groups.map((u, idx) => {
          return <GroupListing key={idx} group={u} />;
        })}
      </div>
      <Fab
        className={classes.addGroupButton}
        onClick={handleClick}
        // variant="contained"
        size="small"
        color="secondary"
      >
        +
      </Fab>
    </div>
  );
};

const GroupListing = ({ group }) => {
  const classes = useStyles();
  const { params } = useRouteMatch('/kudo/:course');
  const [settingsClicked, setSettingClicked] = useState(false);

  return (
    <div className={classes.groupListingContainer}>
      <Button
        component={Link}
        // MRTODO:  redirect to chat
        to={`/kudo/${params.course}/group/${group}`}
        classes={{ root: classes.userButton }}
        key={group}
      >
        <Box mx={1}>{group}</Box>
      </Button>
      <Button
        component={Link}
        // MRTODO:  redirect to chat
        to={`/kudo/${params.course}/group/${group}/settings`}
        // classes={{ root: classes.userButton }}
      >
        <SettingsIcon
          color="disabled"
          onClick={() => console.log('settings clicked!')}
        />
      </Button>
    </div>
  );
};

export { ChatPane };
