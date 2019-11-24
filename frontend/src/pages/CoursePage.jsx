import React, { useEffect, useState } from 'react';
import { makeStyles, Container, Box } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { TextField, Button } from '@material-ui/core/';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { useCourse, api, useAnnouncements } from '../utils';
import { useUsername } from './CreateGroup';
import { AnnouncementsDisplay } from './AnnouncementsDisplay';
import { DeadlinesDisplay } from '../components/DeadlinesDisplay';

const makePath = (path, course) => {
  return `/kudo/${course}${path}`;
};

const CoursePage = () => {
  return (
    <Box
      padding={3}
      display="flex"
      justifyContent="center"
      flexDirection="column"
      height="100%"
    >
      <Box display="flex" flexDirection="column" flexGrow="1">
        <UserDeadlines />
      </Box>
      <Box display="flex" flexDirection="column" flexGrow="1">
        <UserCourseAnnouncements />
      </Box>
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
  }, [course]);

  return (
    <div>
      <DeadlinesDisplay title="Deadlines" deadlines={chartData} />
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
