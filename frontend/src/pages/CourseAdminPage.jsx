import React, { useContext, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { CurrentUser } from '../App';
import { makePath } from './Kudo';
import TimeLine from 'react-gantt-timeline';
import { Box, Typography } from '@material-ui/core';
import { api, useCourse, useAnnouncements, useUsername } from '../utils';
import { CourseAnnouncements } from './CoursePage';

const DeadlineManagement = () => {
  const currUser = useContext(CurrentUser);
  const course = useCourse();
  const [deadlineName, setDeadlineName] = React.useState('');
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

  if (!currUser.admin) {
    return <Redirect to={makePath('/dashboard')} />;
  }

  const handleEnter = event => {
    if (event.key === 'Enter') {
      let d1 = new Date();
      let d2 = new Date();
      d2.setDate(d2.getDate() + 10);
      const newDeadline = {
        id: chartData.length ? chartData[chartData.length - 1].id + 1 : 0, // increment by one each time
        start: d1,
        end: d2,
        name: deadlineName,
        color: 'purple',
      };
      setDeadlineName('');
      setChartData([...chartData, newDeadline]);
    }
  };

  const handleDeadlineNameChange = event => {
    setDeadlineName(event.target.value);
  };

  const handleDeadlineChange = (item, props) => {
    chartData[item.id].start = props.start;
    chartData[item.id].end = props.end;

    setChartData([...chartData]);
  };

  const handleDeadlineSubmit = () => {
    api
      .post(`/${course}/assignment/delete`)
      .then(something => {
        const promises = chartData.map(deadline => {
          return api.post(`/${course}/assignment`, {
            user: currUser.username,
            title: deadline.name,
            desc: '',
            dateFrom: deadline.start,
            dateTo: deadline.end,
          });
        });

        Promise.all(promises)
          .then(something => {
            console.log('Added all deadlines');
            console.log(something);
          })
          .catch(err => {
            console.log('Somethings went wrong when adding deadlines');
            console.log(err);
          });
      })
      .catch(err => {
        console.log('Somethings went wrong when deleting deadlines');
        console.log(err);
      });
  };

  return (
    <div>
      <Box m={2}>
        <TimeLine
          data={chartData}
          mode="year"
          onUpdateTask={handleDeadlineChange}
        />
      </Box>
      <Typography>Add Assignment</Typography>
      <input
        value={deadlineName}
        placeholder="Assignment Name"
        onKeyPress={handleEnter}
        onChange={handleDeadlineNameChange}
      />
      <button onClick={handleDeadlineSubmit}>Commit Changes</button>
    </div>
  );
};

const AnnouncementManagement = () => {
  const course = useCourse();
  const username = useUsername();
  const { announcements, triggerUpdate } = useAnnouncements();
  const [newAnnouncement, setNewAnnouncement] = useState('');

  const handleEnter = event => {
    if (event.key === 'Enter') {
      api
        .post(`/${course}/announcements`, {
          content: newAnnouncement,
          username: username,
        })
        .then(res => {
          triggerUpdate();
        })
        .catch(err => {
          console.log('Error posting course announcement');
          console.log(err);
        });
      setNewAnnouncement('');
    }
  };

  return (
    <div>
      <h1>Announcement Management</h1>
      <input
        value={newAnnouncement}
        placeholder="Announcement Message"
        onKeyPress={handleEnter}
        onChange={event => setNewAnnouncement(event.target.value)}
      />
      <h2>Current announcements:</h2>
      <CourseAnnouncements announcements={announcements} />
    </div>
  );
};

export const CourseAdminPage = () => {
  return (
    <div>
      <DeadlineManagement />
      <AnnouncementManagement />
    </div>
  );
};
