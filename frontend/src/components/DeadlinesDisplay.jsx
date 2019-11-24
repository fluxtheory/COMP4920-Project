import React from 'react';
import { Box, Divider } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import TimeLine from 'react-gantt-timeline';

const config = {
  header: {
    top: {
      style: {
        fontSize: 18,
        height: 70,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    middle: {
      style: {
        fontSize: 9,
        height: 70,
      },
    },
    bottom: {
      style: {
        fontSize: 9,
        height: 70,
      },
      selectedStyle: {
        background: 'linear-gradient( #d011dd ,#d011dd)',
        fontWeight: 'bold',
        color: 'white',
      },
    },
  },
  taskList: {
    title: {
      label: 'Event',
      style: {
        fontSize: '20px',
      },
    },
    task: {
      style: {
        fontSize: '25px',
        padding: '15px',
      },
    },
    verticalSeparator: {
      style: {},
      grip: {
        style: {},
      },
    },
  },
  dataViewPort: {
    rows: {
      style: {},
    },
    task: {
      showLabel: true,
      style: {},
    },
  },
};

export const DeadlinesDisplay = ({
  title,
  deadlines,
  onUpdateDeadline: handleDeadlineChange,
}) => {
  return (
    <Box width="100%">
      <Box width="65%" marginBottom="20px">
        <Typography gutterBottom variant="h3">
          {title}
        </Typography>
        <Divider />
      </Box>
      <DeadlineContent
        deadlines={deadlines}
        onUpdateDeadline={handleDeadlineChange}
      />
    </Box>
  );
};

const DeadlineContent = ({
  deadlines: chartData,
  onUpdateDeadline: handleDeadlineChange,
}) => {
  if (!chartData || !chartData.length) {
    return <Typography variant="h5">No deadlines! Hoorah!</Typography>;
  }
  return (
    <Box m={2}>
      <TimeLine
        mode="year"
        data={chartData}
        config={config}
        itemheight={45}
        onUpdateDeadline={handleDeadlineChange}
      />
    </Box>
  );
};
