/* eslint-disable react/prop-types */
/**
 * What's My Home Worth Page
 *
 * This is the page we show
 */
import React from 'react';
import { compose } from 'redux';
import PaperBox from 'components/PaperBox';
import Grid from '@material-ui/core/Grid';
import FormOne from 'forms/HomeWorth';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

const HomeWorth = (props) => {
  console.log('Home Worth Page');
  return (
    <div className={props.classes.div}>
      <PaperBox title="What's My Home Worth" />
      <Grid container spacing={24}>
        <Grid item sm={12} md={6}>
          <PaperBox title="Personal Information" >
            <FormOne />
          </PaperBox>
        </Grid>
        <Grid item sm={12} md={6}>
          <PaperBox title="Other Stuff" >

          </PaperBox>
        </Grid>
      </Grid>
    </div>
  );
};

export default compose(
  withStyles(styles),
)(HomeWorth);
