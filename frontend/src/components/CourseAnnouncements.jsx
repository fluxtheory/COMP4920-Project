import React from 'react';
import { Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Textfit from 'react-textfit/lib/Textfit';
import { theme } from '../App';

// Border around announcments
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
