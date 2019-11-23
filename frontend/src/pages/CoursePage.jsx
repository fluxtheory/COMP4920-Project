import React, { useEffect, useState } from 'react';
import { makeStyles, Container, Box } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TextField, Button } from '@material-ui/core/';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { useCourse, api } from '../utils';
import TimeLine from 'react-gantt-timeline';
import Textfit from 'react-textfit/lib/Textfit';
import { useUsername } from './CreateGroup';
import { useAnnouncements } from './CourseAdminPage';

const makePath = (path, course) => {
  return `/kudo/${course}${path}`;
};

const CoursePage = () => {
  const { params } = useRouteMatch('/kudo/:course');
  const course = params.course;

  return (
    <div>
      <Typography variant="h2">Deadlines</Typography>
      <UserDeadlines />
      <Typography variant="h2">Announcements</Typography>
      <UserCourseAnnouncements />
      {/* MRTODO: remove */}
      {/* <Switch>
          <Route path={makePath('/group/create', course)}>
            {() => (
              <div>
                <h1>{`Create group for ${course}`}</h1>
              </div>
            )}
          </Route>
          <Route path={makePath('/group/:group', course)}></Route>
          <Route path={makePath('/group/:group/settings', course)}></Route>
        </Switch> */}
    </div>
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

// MRTODO: seperate file
export const CourseAnnouncements = ({ announcements }) => {
  announcements.sort((d1, d2) => {
    if (d1 < d2) return -1;
    return 1;
  });

  return (
    <div style={{ width: '100%' }}>
      {announcements.map((a, idx) => (
        <Box key={idx}>
          <Textfit mode="multi" max={100} min={32}>
            <Box height="100px" width={'100%'}>
              {a.announcement}
            </Box>
          </Textfit>
          <Box>
            <Typography variant="caption">{a.timestamp}</Typography>
          </Box>
        </Box>
      ))}
    </div>
  );
};

const UserCourseAnnouncements = () => {
  const course = useCourse();
  const username = useUsername();
  const { announcements } = useAnnouncements();

  return (
    <div>
      <CourseAnnouncements announcements={announcements} />
    </div>
  );
};

export { CoursePage };
