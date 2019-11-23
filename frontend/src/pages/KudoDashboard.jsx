import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import TimeLine from 'react-gantt-timeline';
import { useUsername } from './CreateGroup';
import { api } from '../utils';
import randomColor from 'randomcolor';
import { CourseAnnouncements } from './CoursePage';

let idCounter = 0;

const getUNSWEvents = () => {
  const unswEvents = [
    {
      id: idCounter++,
      start: new Date('11 Sep 2019'),
      end: new Date('13 Sep 2019'),
      name: 'O-week',
    },
    {
      id: idCounter++,
      start: new Date('16 Sep 2019'),
      end: new Date('25 Nov 2019'),
      name: 'Teaching Period',
      color: 'orange',
    },
    {
      id: idCounter++,
      start: new Date('26 Nov 2019'),
      end: new Date('28 Nov 2019'),
      name: 'Study Period',
      color: 'orange',
    },
    {
      id: idCounter++,
      start: new Date('29 Nov 2019'),
      end: new Date('14 Dec 2019'),
      name: 'Exam Period',
      color: 'orange',
    },
  ];

  return unswEvents;
};

export const KudoDashboard = () => {
  const username = useUsername();
  const [deadlines, setDeadlines] = useState({ UNSW: getUNSWEvents() });
  const unswAnnouncements = [
    {
      announcement:
        'Enjoy your summer break everyone! See you back in 5 days :) !',
      timestamp: new Date().toDateString(),
    },
    {
      announcement:
        'As of next year, UNSW is adopting quadmesters with no change in workload',
      timestamp: new Date('11 Nov 2019').toDateString(),
    },
  ];

  useEffect(() => {
    api
      .get(`/${username}/courses`)
      .then(res => {
        const courses = res.data.map(c => c.code); // array of course string
        const promises = courses.map(c => {
          return api.get(`/${c}/assignment`);
        });

        const courseEventsFormatted = {};
        Promise.all(promises).then(courseEvents => {
          courseEvents.forEach((res, idx) => {
            const deadlines = res.data;
            const color = randomColor({ luminosity: 'bright' });
            const courseDeadlines = deadlines.map(d => {
              return {
                id: idCounter++,
                start: new Date(d.startdate),
                end: new Date(d.deadline),
                name: d.title,
                color: color,
              };
            });
            courseEventsFormatted[courses[idx]] = courseDeadlines;
          });
          setDeadlines({ ...deadlines, ...courseEventsFormatted });
        });
      })
      .catch(err => {
        console.log('Error fetching user courses');
        console.log(err);
      });
  }, []);

  return (
    <div>
      <Box m={2}>
        {Object.entries(deadlines).map(([course, courseDeadlines]) => {
          return (
            <Box key={course}>
              <Typography variant="h3">{course}</Typography>
              <TimeLine data={courseDeadlines} mode="month" rowHeight="70" />
            </Box>
          );
        })}
      </Box>
      <Box>
        <Typography variant="h3">UNSW Announcements</Typography>
        <CourseAnnouncements announcements={unswAnnouncements} />
      </Box>
    </div>
  );
};
