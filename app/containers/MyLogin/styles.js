import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';

export default () => ({
  card: {
    minWidth: 500,
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  loginForm: {
    marginBottom: 12,
    marginTop: 20
  },
  titleBar: {
    backgroundColor: blue[500],
    color: 'white',
    padding: 10
  },
  icon: {
    fontFamily: 'Material Icons',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 60,
    lineHeight: 1,
    letterSpacing: 'normal',
    textTransform: 'none',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    wordWrap: 'normal'
  },
  loginError: {
    color: red[500]
  }
});
