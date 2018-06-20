import React from 'react';
import { connect } from 'react-redux';
import ContactForm from './ContactForm';

class FormOne extends React.Component {
  submit = (values) => {
    console.log('Form Values: ', values);
  };

  render() {
    return <ContactForm onSubmit={this.submit} />;
  }
}

const mapDispatchToProps = (dispatch) => ({
  addValues: (values) => dispatch(console.log('Dispatch Form Values: ', values))
});

export default connect(undefined, mapDispatchToProps)(FormOne);
