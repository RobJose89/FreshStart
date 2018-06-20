/* eslint-disable react/prop-types */
/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */
import React from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  div: {
    textAlign: 'center',
    marginTop: '150px',
  },
};

const NotFound = (props) => {
  console.log('page not found');
  return (
    <div className={props.classes.div}>
      <h2>
    Page not found.
      </h2>
    </div>
  );
};

export default compose(
  withStyles(styles),
)(NotFound);
