import { VERSION, socialMediaLinks } from 'config';
import React from 'react';
import { NewTabLink } from 'components/ui';
import './index.scss';
import Grid from '@material-ui/core/Grid/Grid';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography/Typography';
import { Colors } from '../../Root';
import OutlinedInput from '@material-ui/core/OutlinedInput/OutlinedInput';
import Button from '@material-ui/core/Button/Button';
import IconButton from '@material-ui/core/IconButton/IconButton';
import TwitterIcon from 'mdi-material-ui/Twitter';
import FacebookIcon from 'mdi-material-ui/Facebook';
import MediumIcon from 'mdi-material-ui/Medium';
import FooterLogo from '../../assets/images/footer-logo.png';

interface OwnProps {
  latestBlock: string;
}

interface State {
  isDisclaimerOpen: boolean;
}

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
      paddingBottom: theme.spacing.unit * 10
    },
    bottomBar: {
      backgroundColor: theme.palette.primary.main,
      height: 65,
      padding: '0 45px',
      color: Colors.white
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
    }
  });

type Props = OwnProps & WithStyles<typeof styles>;

class Footer extends React.PureComponent<Props, State> {
  public state: State = {
    isDisclaimerOpen: false
  };

  public render() {
    const { classes } = this.props;

    return (
      <Grid container={true}>
        <Grid container={true} className={classes.footerContentGrid}>
          <Grid item={true} md={3}>
            <Grid container={true} direction="row" spacing={16} justify="center">
              <img src={FooterLogo} className={classes.footerImage} />
              {false && (
                <React.Fragment>
                  <Grid item={true}>
                    <OutlinedInput
                      type="email"
                      name="email"
                      autoComplete="email"
                      labelWidth={0}
                      classes={{
                        notchedOutline: classes.inputBorder,
                        focused: classes.inputFocus,
                        root: classes.inputRoot
                      }}
                      placeholder="Email Address"
                    />
                  </Grid>
                  <Grid item={true}>
                    <Button variant="raised" color="primary" className={classes.submitButton}>
                      Subscribe
                    </Button>
                  </Grid>
                </React.Fragment>
              )}
            </Grid>
          </Grid>
          {footerMenuItems.map(column => (
            <Grid key={column.title} item={true} md={2}>
              <Grid container={true} direction="column">
                <Typography color="inherit" className={classes.footerMenuHeaders}>
                  {column.title}
                </Typography>
                {column.items.map(item => (
                  <a
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
          <Grid item={true} md={3} container={true} alignItems="center">
            {socialMediaLinks.map((socialMediaItem, idx) => (
              <IconButton key={idx} color="inherit" className={classes.socialMediaButtons}>
                <NewTabLink
                  href={socialMediaItem.link}
                  aria-label={socialMediaItem.text}
                  className={classes.socialMediaButtonsLink}
                >
                  {socialMediaItem.text === 'twitter' ? (
                    <TwitterIcon />
                  ) : socialMediaItem.text === 'medium' ? (
                    <MediumIcon />
                  ) : (
                    <FacebookIcon />
                  )}
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
            <Typography color="inherit">{VERSION}</Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Footer);
