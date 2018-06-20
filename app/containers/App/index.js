import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import ApplicationFrame from 'components/ApplicationFrame';
import LoginPage from 'containers/LoginPage';
import Login from 'containers/MyLogin';
import LogoutPage from 'containers/LogoutPage';
import EditMapScreen from 'containers/EditMapScreen';
import MapsListScreen from 'containers/MapsListScreen';
import SchoolYearsListScreen from 'containers/SchoolYearsListScreen';
import EditSchoolYear from 'containers/EditSchoolYear';
import UsersListPage from 'containers/UsersListPage';
import HomeWorthPage from 'containers/HomeWorthPage';
import NotFoundPage from 'containers/NotFoundPage';

function App(props) {
  console.log('App: ', props);
  return (
    <div>
      <Helmet
        titleTemplate="%s - Husfelt Test Application"
        defaultTitle="Husfelt Test Application"
      >
        <meta name="description" content="Husfelt Test Application" />
      </Helmet>

      <ApplicationFrame>
        <Switch>
          <Route exact path="/" component={() => (props.isLoggedIn ? <Redirect to="/school-years" /> : <Redirect to="/login" />)} />
          <Route exact path="/maps" component={MapsListScreen} />
          <Route exact path="/map/create" component={EditMapScreen} />
          <Route exact path="/map/edit/:id" component={EditMapScreen} />
          <Route exact path="/school-years" component={SchoolYearsListScreen} />
          <Route exact path="/school-year/edit/:id" component={EditSchoolYear} />
          <Route exact path="/my-home-worth" component={HomeWorthPage} />

          <Route exact path="/users" component={UsersListPage} />

          <Route exact path="/login" component={(p) => (props.isLoggedIn ? <Redirect to="/" /> : <Login {...p} />)} />
          <Route exact path="/logout" component={LogoutPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </ApplicationFrame>

    </div>
  );
}

App.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

const ConnectedApp = connect(
  (state) => ({
    isLoggedIn: Boolean(state.getIn(['global', 'token'])),
  })
  , null)(App);

export default withRouter(ConnectedApp);
