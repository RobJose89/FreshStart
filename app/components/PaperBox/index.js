import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
    margin: '10px 0',
    padding: '10px 10px 0 10px'
  },
  header: {
    background: '#EDE7F6',
    padding: 10,
    marginBottom: 10,
    fontSize: 18
  }
});

const PaperBox = (props) => (
  <Paper className={props.classes.paper}>
    <Typography variant="headline" component="h3" className={props.classes.header}>
      {props.title}
    </Typography>
    {props.children}
  </Paper>
);

PaperBox.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(PaperBox);
