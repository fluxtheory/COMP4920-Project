import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { UserSearchForm } from './course/UserSearchForm';
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
}));

function CustomizedExpansionPanels() {
  const [expanded, setExpanded] = React.useState('panel1');
  const classes = useStyles();
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
      >
        <ExpansionPanelSummary
          aria-controls="panel3d-content"
          id="panel3d-header"
        >
          <Typography>Groups</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
            lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

export { CustomizedExpansionPanels as ChatPane };
