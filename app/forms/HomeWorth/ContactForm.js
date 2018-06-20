import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import {
  Checkbox,
  TextField,
} from 'redux-form-material-ui';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';


const ContactForm = (props) => {
  const {
    classes, handleSubmit, pristine, reset, submitting
  } = props;

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <div className={classes.div}>
        <label htmlFor="firstName" className={classes.label}>First Name</label>
        <div>
          <Field
            id="firstName"
            name="firstName"
            component={TextField}
            type="text"
            placeholder="John"
          />
        </div>
      </div>
      <div className={classes.div}>
        <label htmlFor="lastName" className={classes.label}>Last Name</label>
        <div>
          <Field
            id="lastName"
            name="lastName"
            component={TextField}
            type="text"
            placeholder="Doe"
          />
        </div>
      </div>
      <div className={classes.div}>
        <label htmlFor="email" className={classes.label}>Email</label>
        <div>
          <Field
            id="email"
            name="email"
            component={TextField}
            type="email"
            placeholder="john.doe@gmail.com"
          />
        </div>
      </div>
      <div className="radio-buttons {classes.div}">
        <label className={classes.label}>Sex</label>
        <label className={classes.label}>
          <Field
            name="sex"
            component="input"
            type="radio"
            value="male"
          />{' '}
            Male
        </label>
        <label className={classes.label}>
          <Field
            name="sex"
            component="input"
            type="radio"
            value="female"
          />{' '}
            Female
        </label>
      </div>
      <div className={classes.div}>
        <label htmlFor="favoriteColor" className={classes.label}>Favorite Color</label>
        <div>
          <Field id="favoriteColor" name="favoriteColor" component="select">
            <option value="ff0000">Red</option>
            <option value="00ff00">Green</option>
            <option value="0000ff">Blue</option>
          </Field>
        </div>
      </div>
      <div>
        <label htmlFor="employed" className={classes.label}>Employed</label>
        <div>
          <Field
            name="employed"
            id="employed"
            component={Checkbox}
            type="checkbox"
          />
        </div>
      </div>
      <div className={classes.div}>
        <label htmlFor="notes" className={classes.label}>Notes</label>
        <div>
          <Field
            id="notes"
            name="notes"
            component={TextField}
          />
        </div>
      </div>
      <div className={classes.div}>
        <Button className={classes.button} variant="raised" color="primary" type="submit" disabled={pristine || submitting}>
            Submit
        </Button>
        <Button className={classes.button} variant="raised" color="secondary" type="button" disabled={pristine || submitting} onClick={reset}>
            Clear Values
        </Button>
      </div>
    </form>
  );
};

ContactForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const FormWithStyle = compose(withStyles(styles))(ContactForm);

export default reduxForm({
  form: 'simple' // a unique identifier for this form
})(FormWithStyle);
