import React from 'react';
import { Amazing } from '../components/Amazing';
import { makeStyles, Box, Typography } from '@material-ui/core';

const FullWindowSlide = ({ children, color }) => {
  return (
    <Box height="100vh" width="100vw" bgcolor={color} background="pink">
      {children}
    </Box>
  );
};

const useStyles = makeStyles({
  imageContainer: {
    background: 'rgb(88,181,184)',
    background:
      'linear-gradient(90deg, rgba(88,181,184,1) 0%, rgba(222,222,222,1) 50%, rgba(88,181,184,1) 100%)',
  },
});

const Home = () => {
  const classes = useStyles();
  return (
    // <Box height="100%">
    //   <div>
    //     <FullWindowSlide color="pink">
    //       <Box
    //         display="flex"
    //         justifyContent="center"
    //         alignItems="center"
    //         height="100%"
    //         // component={Typography}
    //         color="#f5f5f5"
    //         letterSpacing={35}
    //         fontSize={190}
    //       >
    //         KUDO
    //       </Box>
    //     </FullWindowSlide>
    //     <FullWindowSlide color="#5d005d">
    //       <Box py={18} px={12}>
    //         <Box
    //           display="flex"
    //           justifyContent="start"
    //           alignItems="start"
    //           height="100%"
    //           component={Typography}
    //           color="gold"
    //           variant="h1"
    //           letterSpacing={7}
    //         >
    //           Learning done right
    //           <br />
    //           Learning in communities
    //         </Box>
    //       </Box>
    //     </FullWindowSlide>
    //     <FullWindowSlide color="#007066">
    //       <Box py={18} px={12} height="100%">
    //         <Box
    //           display="flex"
    //           justifyContent="start"
    //           alignItems="start"
    //           height="100%"
    //           component={Typography}
    //           color="gold"
    //           variant="h1"
    //           letterSpacing={7}
    //           style={{ direction: 'rtl' }}
    //         >
    //           Learn Together
    //           <br />
    //           Communicate together
    //         </Box>
    //       </Box>
    //     </FullWindowSlide>
    //     <FullWindowSlide color="#007066">
    //       <Box py={18} px={12} height="100%">
    //         <Box
    //           display="flex"
    //           justifyContent="start"
    //           alignItems="start"
    //           height="100%"
    //           component={Typography}
    //           color="gold"
    //           variant="h1"
    //           letterSpacing={7}
    //           style={{ direction: 'rtl' }}
    //         >

    //         </Box>
    //       </Box>
    //     </FullWindowSlide>
    //   </div>
    // </Box>
    <Box
      className={classes.imageContainer}
      display="flex"
      justifyContent="center"
    >
      <Box
        component="img"
        src="https://i.imgur.com/DTrpESn.png"
        width="1000px"
      />
    </Box>
  );
};

export { Home };
