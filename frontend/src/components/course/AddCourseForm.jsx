import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab/';
import {
  TextField,
  Button,
  Fab,
  Box,
  Typography,
  Divider,
} from '@material-ui/core/';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { FixedSizeList } from 'react-window';

function renderRow(props) {
  const { data, index, style } = props;

  return React.cloneElement(data[index], {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      display: 'block',
      ...style,
    },
  });
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const { children, ...other } = props;
  const smUp = useMediaQuery(theme => theme.breakpoints.up('sm'));
  const itemCount = Array.isArray(children) ? children.length : 0;
  const itemSize = 80;

  const outerElementType = React.useMemo(() => {
    return React.forwardRef((props2, ref2) => (
      <div ref={ref2} {...props2} {...other} />
    ));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref}>
      <FixedSizeList
        // style={{
        //   padding: 0,
        //   height: Math.min(8, itemCount) * itemSize,
        //   maxHeight: 'auto',
        // }}
        itemData={children}
        height={450}
        width="100%"
        outerElementType={outerElementType}
        innerElementType="ul"
        itemSize={itemSize}
        overscanCount={5}
        itemCount={itemCount}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
});

const useStyles = makeStyles(theme => ({
  toggleButton: {
    margin: '1rem 0',
  },
  courseForm: {
    width: '100%',
  },
  courseFormWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1rem auto',
  },
  listbox: {
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },

  searchOption: {
    height: 'auto',
  },
}));

const allCourses = require('../../text/courses.json');

function AddCourseForm(props) {
  const classes = useStyles();

  const [newCourse, setNewCourse] = React.useState('');
  const [searchbarVisible, setSearchbarVisible] = React.useState(false);
  const [error, setError] = React.useState('');

  // MRTODO: clean
  const handleChange = (event, value) => {
    if (!value) {
      props.addCourse(newCourse);
      return setNewCourse('');
    }
    setNewCourse(value.code);
  };

  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: option => option.code,
  });

  const renderCourseOption = (option, state) => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        marginBottom="3px"
        height="100%"
      >
        <Typography variant="h6">{option.code}</Typography>
        <Box whiteSpace="normal" fontSize="12px" marginBottom="3px">
          <Typography variant="caption">{option.name}</Typography>
          <Divider />
        </Box>
      </Box>
    );
    console.log('break here');
  };

  return (
    <div className={classes.courseFormWrapper}>
      {searchbarVisible ? (
        <Autocomplete
          className={classes.courseForm}
          filterOptions={filterOptions}
          options={allCourses}
          onChange={handleChange}
          ListboxComponent={ListboxComponent}
          renderOption={renderCourseOption}
          renderInput={params => (
            <TextField
              {...params}
              onChange={handleChange}
              variant="outlined"
              placeholder="Enter course name/code"
              autoFocus
              fullWidth
            />
          )}
          classes={{ option: classes.searchOption }}
          value={newCourse}
          debug //MRTODO
        />
      ) : null}
      <Fab
        className={classes.toggleButton}
        onClick={() => setSearchbarVisible(!searchbarVisible)}
        // variant="contained"
        size="medium"
        color="secondary"
      >
        {searchbarVisible ? '-' : '+'}
      </Fab>

      {error ? <h1>{error}</h1> : null}
    </div>
  );
}

export { AddCourseForm };
