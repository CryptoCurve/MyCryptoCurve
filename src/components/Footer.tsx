import { socialMediaLinks, VERSION } from '../config';
import * as React from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography/Typography';
import IconButton from '@material-ui/core/IconButton/IconButton';
// TODO install lib: mdi-material-ui when I have signal
// import TwitterIcon from 'mdi-material-ui/Twitter';
// import FacebookIcon from 'mdi-material-ui/Facebook';
// import MediumIcon from 'mdi-material-ui/Medium';
import FooterLogo from '../assets/images/footer-logo.png';
import Hidden from '@material-ui/core/Hidden/Hidden';
import { Colors } from '../theme/theme';
import NewTabLink from './NewTabLink';


interface OwnProps {}

interface FooterMenuItem {
  name: string;
  link: string;
}

interface FooterMenuColumn {
  title: string;
  items: FooterMenuItem[];
}

const footerMenuItems: FooterMenuColumn[] = [
  {
    title: 'Curve EcoSystem',
    items: [
      {
        name: 'Block Explorer',
        link: ''
      },
      {
        name: 'Web Application',
        link: ''
      },
      {
        name: 'Mobile App',
        link: ''
      },
      {
        name: 'Curve Site',
        link: ''
      }
    ]
  },
  {
    title: 'About',
    items: [
      {
        name: 'Privacy Policy',
        link: 'https://cryptocurve.network/#privacyPolicy'
      },
      {
        name: 'Cookie Policy',
        link: 'https://cryptocurve.network/#cookiePolicy'
      },
      {
        name: 'About Us',
        link: 'https://cryptocurve.io/about#'
      },
      {
        name: 'Press',
        link: 'https://www.google.co.za/search?tbm=nws&q=cryptocurve&oq=cryptocurve'
      }
    ]
  },
  {
    title: 'Resources',
    items: [
      {
        name: 'Contact Us',
        link: 'https://cryptocurve.io/contact'
      },
      {
        name: 'Blog',
        link: 'https://cryptocurve.io/blog'
      },
      {
        name: 'FAQ',
        link: 'https://cryptocurve.io/#faq'
      }
    ]
  }
];

const styles = (theme: Theme) =>
  createStyles({
    footerContentGrid: {
      backgroundColor: Colors.dark,
      color: Colors.white,
      paddingTop: theme.spacing.unit * 10,
      paddingBottom: theme.spacing.unit * 10,
      [theme.breakpoints.down('sm')]: {
        paddingTop: theme.spacing.unit * 4,
        paddingBottom: theme.spacing.unit * 4
      }
    },
    bottomBar: {
      backgroundColor: theme.palette.primary.main,
      height: 65,
      padding: '0 45px',
      color: Colors.white,
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
        padding: 0,
        paddingBottom: 8
      }
    },
    inputFocus: {
      color: Colors.white,
      borderColor: theme.palette.primary.main
    },
    inputRoot: {
      color: Colors.white,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: Colors.dark,
      borderRadius: 4,
      height: 40,
      '&:hover:not(:focus)': {
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        borderStyle: 'solid'
      },
      '&:focus': {
        borderWidth: 0
      }
    },
    inputBorder: {
      borderColor: Colors.white
    },
    submitButton: {
      minHeight: 40,
      height: 40,
      borderRadius: 4,
      minWidth: 120,
      width: 120,
      fontSize: 10
    },
    footerMenuHeaders: {
      textTransform: 'uppercase',
      fontSize: 15,
      marginBottom: theme.spacing.unit * 2
    },
    footerMenuItem: {
      fontSize: 15,
      marginBottom: theme.spacing.unit
    },
    socialMediaButtons: {
      marginLeft: theme.spacing.unit * 2
    },
    socialMediaButtonsLink: {
      color: Colors.white,
      display: 'flex',
      '&:hover': {
        color: Colors.white
      }
    },
    footerImage: {
      height: 166,
      width: 150
    },
    footerLinks: {
      color: Colors.white,
      '&:hover': {
        color: Colors.white
      },
      '&:focus': {
        color: Colors.white
      }
    },
    footerMenuGrid: {
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing.unit * 3
      }
    },
    socialMediaGrid: {
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center'
      }
    }
  });

type Props = OwnProps & WithStyles<typeof styles>;

class Footer extends React.Component<Props> {
  public render() {
    const { classes } = this.props;
    return (
      <Grid container={true}>
        <Grid container={true} className={classes.footerContentGrid}>
          <Hidden smDown={true}>
            <Grid item={true} md={3}>
              <Grid container={true} direction="row" spacing={16} justify="center">
                <img alt="" src={FooterLogo} className={classes.footerImage} />
              </Grid>
            </Grid>
          </Hidden>
          {footerMenuItems.map(column => (
            <Grid key={column.title} item={true} md={2} xs={12}>
              <Grid container={true} direction="column" className={classes.footerMenuGrid}>
                <Typography color="inherit" className={classes.footerMenuHeaders}>
                  {column.title}
                </Typography>
                {column.items.map(item => (
                  <a
                    key={item.name}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={classes.footerLinks}
                  >
                    <Typography key={item.name} color="inherit" className={classes.footerMenuItem}>
                      {item.name}
                    </Typography>
                  </a>
                ))}
              </Grid>
            </Grid>
          ))}
          <Grid
            item={true}
            md={3}
            xs={12}
            container={true}
            alignItems="center"
            className={classes.socialMediaGrid}
          >
            {socialMediaLinks.map((socialMediaItem, idx) => (
              <IconButton key={idx} color="inherit" className={classes.socialMediaButtons}>
                <NewTabLink
                  href={socialMediaItem.link}
                  aria-label={socialMediaItem.text}
                  className={classes.socialMediaButtonsLink}
                >
                  <React.Fragment>
                    {socialMediaItem.text === 'twitter' ? (
                      // TODO: Replace div with actual icon once lib installed
                      <div>Twitter Icon</div>
                      // <TwitterIcon />
                    ) : socialMediaItem.text === 'medium' ? (
                      // TODO: Replace div with actual icon once lib installed
                      <div>Medium Icon</div>
                      // <MediumIcon />
                    ) : (
                      // TODO: Replace div with actual icon once lib installed
                      <div>Facebook Icon</div>
                      // <FacebookIcon />
                    )}
                  </React.Fragment>
                </NewTabLink>
              </IconButton>
            ))}
          </Grid>
        </Grid>
        <Grid
          container={true}
          className={classes.bottomBar}
          alignItems="center"
          direction="row"
          spacing={16}
        >
          <Grid item={true}>
            <Typography color="inherit">{`© ${new Date().getFullYear()} CryptoCurve & MyCrypto, Inc.`}</Typography>
          </Grid>
          <Grid item={true}>
            <Typography color="inherit" onClick={this.testFunction}>
              {VERSION}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  private testFunction = () => {
    console.log('Test function to trigger events');
    // console.log(this.global);
    // this.global.snackBarPush({
    //   key: new Date().toString(),
    //   message: "This is a new test message",
    //   type: "success"
    // })
  };
}

// @ts-ignore
export default withStyles(styles)(Footer) as React.ComponentClass<OwnProps>;
