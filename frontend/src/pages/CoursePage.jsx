import React, { useEffect, useState } from 'react';
import { makeStyles, Container, Box } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TextField, Button } from '@material-ui/core/';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { useCourse, api, useAnnouncements } from '../utils';
import TimeLine from 'react-gantt-timeline';
import Textfit from 'react-textfit/lib/Textfit';
import { useUsername } from './CreateGroup';
import { theme } from '../App';
import { AnnouncementsDisplay } from './KudoDashboard';

const makePath = (path, course) => {
  return `/kudo/${course}${path}`;
};

const CoursePage = () => {
  return (
    <Box padding={3}>
      <Typography style={{ color: theme.palette.text.title }} variant="h2">
        Deadlines
      </Typography>
      <UserDeadlines />
      <UserCourseAnnouncements />
    </Box>
  );
};

const UserDeadlines = () => {
  const course = useCourse();
  const [chartData, setChartData] = React.useState([]);

  useEffect(() => {
    let idCounter = 0;
    api
      .get(`/${course}/assignment`)
      .then(res => {
        const deadlines = res.data;
        const chartState = deadlines.map(d => {
          return {
            id: idCounter++,
            start: new Date(d.startdate),
            end: new Date(d.deadline),
            name: d.title,
          };
        });

        setChartData(chartState);
      })
      .catch(err => {
        console.log('Error getting course deadlines');
        console.log(err);
      });
  }, []);

  return (
    <div>
      <Box m={2}>
        <TimeLine data={chartData} mode="year" />
      </Box>
    </div>
  );
};

// Border around announcments
// MRTODO: seperate file
export const CourseAnnouncements = ({ announcements }) => {
  // MRTODO: use the timstamps here.
  announcements.sort((d1, d2) => {
    if (d1 < d2) return -1;
    return 1;
  });

  return (
    <div style={{ width: '100%' }}>
      {announcements.map((a, idx) => (
        <Box
          key={idx}
          display="flex"
          flexDirection="column"
          marginBottom="20px"
        >
          <Textfit mode="multi" max={30} min={15}>
            <Box style={{ color: theme.palette.text.subtitle }} width={'100%'}>
              {a.announcement}
            </Box>
          </Textfit>
          <Typography
            style={{ color: theme.palette.text.footer }}
            variant="caption"
          >
            {a.timestamp}
          </Typography>
        </Box>
      ))}
    </div>
  );
};

const UserCourseAnnouncements = () => {
  const { announcements } = useAnnouncements();

  return (
    <div>
      <AnnouncementsDisplay
        title="Course Announcements"
        announcements={announcements}
      />
    </div>
  );
};

export { CoursePage };
