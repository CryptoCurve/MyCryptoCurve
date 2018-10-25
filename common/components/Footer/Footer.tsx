import {
  donationAddressMap,
  VERSION,
  socialMediaLinks,
  affiliateLinks,
  partnerLinks
} from 'config';
import React from 'react';
import DisclaimerModal from 'components/DisclaimerModal';
import { NewTabLink } from 'components/ui';
import './index.scss';
import { translateRaw } from 'translations';
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

const SocialMediaLink = ({ link, text }: { link: string; text: string }) => {
  return (
    <NewTabLink className="SocialMediaLink" key={link} href={link} aria-label={text}>
      <i className={`sm-icon sm-logo-${text}`} />
    </NewTabLink>
  );
};

interface OwnProps {
  latestBlock: string;
}

interface State {
  isDisclaimerOpen: boolean;
}

const footerMenuItems = {
  col1: [
    {
      name: 'Block Explorer'
    },
    {
      name: 'Web Application'
    },
    {
      name: 'Mobile App'
    },
    {
      name: 'Curve Site'
    }
  ],
  col2: [
    {
      name: 'MyCrypto.com'
    },
    {
      name: 'Disclaimer'
    },
    {
      name: 'Support'
    },
    {
      name: 'Faq'
    }
  ]
};

const styles = (theme: Theme) =>
  createStyles({
    footerContentGrid: {
      backgroundColor: Colors.dark,
      color: Colors.white,
      minHeight: 420
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
      <React.Fragment>
        <Grid
          container={true}
          className={classes.footerContentGrid}
          alignItems="center"
          justify="center"
        >
          <Grid item={true} md={5}>
            <Grid container={true} direction="row" spacing={16} justify="center">
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
            </Grid>
          </Grid>
          <Grid item={true} md={2}>
            <Grid container={true} direction="column">
              <Typography color="inherit" className={classes.footerMenuHeaders}>
                Curve Ecosystem
              </Typography>
              {footerMenuItems.col1.map(item => (
                <Typography key={item.name} color="inherit" className={classes.footerMenuItem}>
                  {item.name}
                </Typography>
              ))}
            </Grid>
          </Grid>
          <Grid item={true} md={2}>
            <Grid container={true} direction="column">
              <Typography color="inherit" className={classes.footerMenuHeaders}>
                Information
              </Typography>
              {footerMenuItems.col2.map(item => (
                <Typography key={item.name} color="inherit" className={classes.footerMenuItem}>
                  {item.name}
                </Typography>
              ))}
            </Grid>
          </Grid>
          <Grid item={true} md={3}>
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
        <Grid container={true} className={classes.bottomBar} alignItems="center" direction="row">
          <Grid item={true}>
            <Typography color="inherit">{`© ${new Date().getFullYear()} CryptoCurve & MyCrypto, Inc.`}</Typography>
          </Grid>
          <Grid item={true}>
            <Typography color="inherit">V1.0.0</Typography>
          </Grid>
        </Grid>
        {false && (
          <div>
            <footer className="Footer" role="contentinfo" aria-label="footer">
              <div className="Footer-links Footer-section">
                <div className="Footer-links-social">
                  {socialMediaLinks.map((socialMediaItem, idx) => (
                    <SocialMediaLink
                      link={socialMediaItem.link}
                      key={idx}
                      text={socialMediaItem.text}
                    />
                  ))}
                </div>
              </div>

              <div className="Footer-about Footer-section">
                <div className="Footer-about-links">
                  <NewTabLink href="https://cryptocurve.io/">cryptocurve.io</NewTabLink>
                  <NewTabLink href="https://mycrypto.com/">mycrypto.com</NewTabLink>
                  <NewTabLink href="https://cryptocurve.io/team.php">
                    {translateRaw('FOOTER_TEAM')}
                  </NewTabLink>
                </div>

                <p className="Footer-about-text">{translateRaw('FOOTER_ABOUT')}</p>

                <div className="Footer-about-legal">
                  <div className="Footer-about-legal-text">
                    © {new Date().getFullYear()} CryptoCurve & MyCrypto, Inc.
                  </div>
                  <div className="Footer-about-legal-text">
                    <a onClick={this.toggleModal}>{translateRaw('DISCLAIMER')}</a>
                  </div>
                  <div className="Footer-about-legal-text">v{VERSION}</div>
                </div>
              </div>

              <div className="Footer-support Footer-section">
                <h5 className="Footer-support-title">{translateRaw('FOOTER_AFFILIATE_TITLE')}</h5>
                <div className="Footer-support-affiliates">
                  {affiliateLinks.map((link, i) => (
                    <NewTabLink key={i} href={link.link}>
                      {link.text}
                    </NewTabLink>
                  ))}
                </div>

                <div className="Footer-support-donate">
                  <div className="Footer-support-donate-currency">
                    {translateRaw('DONATE_CURRENCY', { $currency: 'ETH' })}
                  </div>
                  <div className="Footer-support-donate-address">{donationAddressMap.ETH}</div>
                </div>

                <div className="Footer-support-donate">
                  <div className="Footer-support-donate-currency">
                    {translateRaw('DONATE_CURRENCY', { $currency: 'BTC' })}
                  </div>
                  <div className="Footer-support-donate-address">{donationAddressMap.BTC}</div>
                </div>

                <div className="Footer-support-friends">
                  {partnerLinks.map((link, i) => (
                    <NewTabLink key={i} href={link.link}>
                      {link.text}
                    </NewTabLink>
                  ))}
                </div>
              </div>
            </footer>
            <DisclaimerModal isOpen={this.state.isDisclaimerOpen} handleClose={this.toggleModal} />
          </div>
        )}
      </React.Fragment>
    );
  }

  private toggleModal = () => {
    this.setState(state => {
      this.setState({ isDisclaimerOpen: !state.isDisclaimerOpen });
    });
  };
}

export default withStyles(styles)(Footer);
