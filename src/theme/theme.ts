import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export const Colors = {
  white: '#fff',
  purpley: '#8964DC',
  lavender: '#beaceb',
  lightLavender: '#e4d9ff',
  dark: '#272532',
  darkHover: '#52505b'
};

export const cryptoCurveMainTheme = createMuiTheme({
  palette: {
    primary: {
      main: Colors.purpley
    },
    secondary: {
      main: '#40409A'
    },
    text: {
      // secondary: '#fff',
      primary: Colors.dark
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: ['Abel', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    headline: {
      fontFamily: [
        'bebasneue_bold',
        'Abel',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
      ].join(','),
      textTransform: 'uppercase',
      fontSize: 40,
      letterSpacing: 5.3
    },
    title: {
      fontFamily: [
        'bebasneue_regular',
        'Abel',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
      ].join(','),
      textTransform: 'uppercase',
      fontSize: 25,
      letterSpacing: 5,
      lineHeight: '27px'
    },
    h1: {
      fontFamily: ['BebasneueBold', 'Abel', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'
      ].join(','),
      textTransform: 'uppercase',
      fontSize: 40,
      letterSpacing: 6,
      lineHeight: '44px'
    },
    h3: {
      fontFamily: ['BebasneueBold', 'Abel', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
      textTransform: 'uppercase',
      fontSize: 25,
      letterSpacing: 5,
      lineHeight: '27px'
    },
    h5: {
      textTransform: 'uppercase',
      fontSize: 15,
      letterSpacing: 1.5,
      lineHeight: '20px'
    },
    display1: {
      fontFamily: ['BebasneueRegular', 'Abel', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'
      ].join(','),
      textTransform: 'uppercase',
      fontSize: 35,
      letterSpacing: 7,
      lineHeight: '38px'
    },
    body1: {
      fontSize: 20,
      lineHeight: "26px",
      letterSpacing: 1.5
    },
    button: {
      color: Colors.white,
      letterSpacing: '2px',
      lineHeight: '26px'
    }
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 50,
        minHeight: 50,
        textTransform: 'none',
        fontSize: 20,
        minWidth: 300
      },
      outlined: {
        borderWidth: ['2px', '!important'].join(' ')
      }
    },
    MuiInput: {
      input: {
        fontSize: 20,
        lineHeight: 1.3,
        letterSpacing: 2,
        padding: ['8px', 0, '7px'].join(' '),
        marginTop: 4
      }
    },
    MuiFormLabel: {
      root: {
        fontSize: 20,
        lineHeight: '26px',
        letterSpacing: 2
      }
    },
    MuiList: {
      root: {
        border: ['solid', '1px', Colors.lavender].join(' '),
        borderRadius: 8
      }
    },
    MuiPaper: {
      rounded: {
        borderRadius: 8
      }
    },
    MuiListItem: {
      selected: {
        backgroundColor: [Colors.lavender, '!important'].join(' '),
        color: [Colors.white, '!important'].join(' ')
      },
      button: {
        '&:hover': {
          backgroundColor: Colors.lightLavender
        }
      }
    }
  }
});

export const customStyles = {
  darkButton: {
    color: Colors.white,
    backgroundColor: Colors.dark,
    '&:hover': {
      backgroundColor: Colors.darkHover
    }
  },
  buttonEndIconSpacing: {
    marginLeft: cryptoCurveMainTheme.spacing.unit * 2
  }
};
