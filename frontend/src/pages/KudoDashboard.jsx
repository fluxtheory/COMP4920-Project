import React from 'react';
import { Box } from '@material-ui/core';
import TimeLine from 'react-gantt-timeline';

export const KudoDashboard = () => {
  let d1 = new Date();
  let d2 = new Date();
  d2.setDate(d2.getDate() + 5);
  let d3 = new Date();
  d3.setDate(d3.getDate() + 8);
  let d4 = new Date();
  d4.setDate(d4.getDate() - 100);
  const chartData = [
    {
      id: 1,
      start: new Date('11 Sep 2019'),
      end: new Date('13 Sep 2019'),
      name: 'O-week',
    },
    {
      id: 2,
      start: new Date('16 Sep 2019'),
      end: new Date('25 Nov 2019'),
      name: 'Teaching Period',
      color: 'orange',
    },
    {
      id: 3,
      start: new Date('26 Nov 2019'),
      end: new Date('28 Nov 2019'),
      name: 'Study Period',
      color: 'orange',
    },
    {
      id: 4,
      start: new Date('29 Nov 2019'),
      end: new Date('14 Dec 2019'),
      name: 'Exam Period',
      color: 'orange',
    },
  ];

  const styling = {
    offsetY: 60,
    rowHeight: 70,
    barHeight: 16,
    thickWidth: 1.4,
    styleOptions: {
      bgColor: '#fff',
      lineColor: '#eee',
      redLineColor: '#f04134',
      groupBack: '#3db9d3',
      groupFront: '#299cb4',
      taskBack: '#65c16f',
      taskFront: '#46ad51',
      milestone: '#d33daf',
      warning: '#faad14',
      danger: '#f5222d',
      link: '#ffa011',
      textColor: '#222',
      lightTextColor: '#999',
      lineWidth: '1px',
      thickLineWidth: '1.4px',
      fontSize: '14px',
      smallFontSize: '12px',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
  };
  return (
    <div>
      <Box m={2}>
        <TimeLine data={chartData} mode="month" rowHeight="70" {...styling} />
      </Box>
    </div>
  );
};
