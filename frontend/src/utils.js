import Axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Session } from './App';

const api = Axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.request.use(
  function(config) {
    const authToken = localStorage.getItem('userToken');
    config.headers.Authorization = authToken;

    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

const useCourse = () => {
  const { params } = useRouteMatch('/kudo/:course');
  return params.course;
};

const useCurrentPage = () => {
  // const { params } = useRouteMatch('/kudo/:course/:activePage');
  const match = useRouteMatch('/kudo/:course/:activePage');
  if (match) {
    return match.params.activePage;
  }

  return null;
};

const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [shouldUpdate, setShouldUpdate] = useState({});
  const course = useCourse();

  useEffect(() => {
    api
      .get(`/${course}/announcements`)
      .then(res => {
        const fetchedAnnouncements = res.data.data;
        const formattedAnnouncements = fetchedAnnouncements.map(a => {
          return { announcement: a.announcement, timestamp: a.datetime };
        });

        setAnnouncements(formattedAnnouncements);
      })
      .catch(err => {
        console.log('Error fetching course announcements');
      });
  }, [shouldUpdate, course]);

  const triggerUpdate = () => setShouldUpdate({});

  return { announcements, triggerUpdate };
};

const useUsername = () => {
  const session = useContext(Session);
  const username = session.user.id;
  return username;
};

export { api, useCourse, useCurrentPage, useAnnouncements, useUsername };
