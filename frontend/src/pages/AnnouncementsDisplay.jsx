import React from 'react';
import { Box, Typography, Divider } from '@material-ui/core';
import { CourseAnnouncements } from '../components/CourseAnnouncements';
import { Scrollbars } from 'react-custom-scrollbars';

export const AnnouncementsDisplay = ({ title, announcements }) => {
  const haveAnnouncements = !!announcements.length;
  return (
    <Box width="65%">
      <Box marginBottom="20px">
        <Typography gutterBottom variant="h3">
          {title}
        </Typography>
        <Divider />
      </Box>
      {haveAnnouncements ? (
        <CourseAnnouncements announcements={announcements} />
      ) : (
        <Typography variant="h5">No announcements!</Typography>
      )}
    </Box>
  );
};
