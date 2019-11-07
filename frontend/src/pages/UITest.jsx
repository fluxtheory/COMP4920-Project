import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  kudoApp: {
    display: 'grid',
    gridGap: '1rem',
    gridTemplateColumns: '1fr 5fr 2fr',
    // gridTemplateRows: '1fr 5fr 1fr',
    gridTemplateAreas: `"left middle right"
                        "left middle right"
                        "left middle right"`,
    height: '100vh',
    width: '100%',
    fontSize: '2rem',
  },

  topTabBar: {
    gridArea: 'header',
    background: 'red',
  },

  leftPane: {
    gridArea: 'left',
    background: 'blue',
  },

  rightPane: {
    gridArea: 'right',
    background: 'purple',
  },

  contentArea: {
    gridArea: 'middle',
    background: 'papayawhip',
  },
}));

const UITest = () => {
  const classes = useStyles();

  return (
    <div className={classes.kudoApp}>
      <div className={classes.leftPane}>Left Pane</div>
      <div className={classes.contentArea}>Changing Content</div>
      <div className={classes.rightPane}>Right Pane</div>
    </div>
  );
};

export { UITest };
