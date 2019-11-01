import React from 'react';


const AllChat = () => {
  if (localStorage.getItem('userToken') === null) {
    return <Redirect to="/login" />;
  }

  if (!localStorage.hasOwnProperty('userToken')) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <h1>welcome.</h1>
      <div>
        <PublicChat />
      </div>
    </div>
  );
};

export { AllChat };
