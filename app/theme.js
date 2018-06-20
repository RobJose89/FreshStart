import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import deepOrange from '@material-ui/core/colors/deepOrange';
import red from '@material-ui/core/colors/red';

export default createMuiTheme({
  palette: {
    primary: {
      light: green['200'],
      main: green['600'],
      dark: green['900'],
      contrastText: '#fff',
    },
    secondary: {
      light: deepOrange['200'],
      main: deepOrange['600'],
      dark: deepOrange['900'],
      contrastText: '#fff',
    },
    error: {
      light: red['200'],
      main: red['600'],
      dark: red['900'],
      contrastText: '#fff',
    },
  },
});
