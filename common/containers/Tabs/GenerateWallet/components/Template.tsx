import React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import './Template.scss';
import translate from 'translations';
import Grid from '@material-ui/core/Grid/Grid';
import Button from '@material-ui/core/Button/Button';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import { ArrowBack, InfoOutlined } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import IconButton from '@material-ui/core/IconButton/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener/ClickAwayListener';
import Zoom from '@material-ui/core/Zoom/Zoom';

interface OwnProps {
  children: React.ReactElement<any>;
  version?: number;
  title?: string;
  tooltip?: string;
}

const styles = (theme: Theme) =>
  createStyles({
    layout: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flexGrow: 1
    },
    title: {
      ...theme.typography.title
    },
    backButton: {
      position: 'absolute',
      left: theme.spacing.unit * 15
    },
    buttonRow: {
      marginTop: theme.spacing.unit * 20
    },
    tooltip: {
      ...theme.typography.caption,
      color: '#fff',
      backgroundColor: theme.palette.secondary.main,
      borderRadius: 50,
      padding: theme.spacing.unit * 4,
      display: 'flex',
      alignItems: 'center',
      maxWidth: 380
    },
    arrowPopper: {
      '&[x-placement*="bottom"] $arrowArrow': {
        top: 0,
        left: 0,
        marginTop: '-0.9em',
        width: '3em',
        height: '1em',
        '&::before': {
          borderWidth: '0 1em 1em 1em',
          borderColor: `transparent transparent ${theme.palette.secondary.main} transparent`
        }
      },
      '&[x-placement*="top"] $arrowArrow': {
        bottom: 0,
        left: 0,
        marginBottom: '-0.9em',
        width: '3em',
        height: '1em',
        '&::before': {
          borderWidth: '1em 1em 0 1em',
          borderColor: `${theme.palette.secondary.main} transparent transparent transparent`
        }
      },
      '&[x-placement*="right"] $arrowArrow': {
        left: 0,
        marginLeft: '-0.9em',
        height: '3em',
        width: '1em',
        '&::before': {
          borderWidth: '1em 1em 1em 0',
          borderColor: `transparent ${theme.palette.secondary.main} transparent transparent`
        }
      },
      '&[x-placement*="left"] $arrowArrow': {
        right: 0,
        marginRight: '-0.9em',
        height: '3em',
        width: '1em',
        '&::before': {
          borderWidth: '1em 0 1em 1em',
          borderColor: `transparent transparent transparent ${theme.palette.secondary.main}`
        }
      }
    },
    arrowArrow: {
      position: 'absolute',
      fontSize: 10,
      width: '3em',
      height: '3em',
      '&::before': {
        content: '""',
        margin: 'auto',
        display: 'block',
        width: 0,
        height: 0,
        borderStyle: 'solid'
      }
    }
  });

interface State {
  tooltipOpen: boolean;
}

type Props = OwnProps & RouteComponentProps<{}> & WithStyles<typeof styles>;

class GenerateWalletTemplate extends React.Component<Props, State> {
  public state = {
    tooltipOpen: false
  };

  public render() {
    const { children, version, history, classes, title, tooltip } = this.props;
    const { tooltipOpen } = this.state;
    return version === 2 && title ? (
      <main className={classes.layout}>
        <Grid
          container={true}
          direction="row"
          justify="space-evenly"
          alignItems="center"
          spacing={16}
        >
          <Grid container={true} item={true} xs={12} sm={1} md={1} lg={1} xl={1} justify="center">
            <Button
              variant="fab"
              color="primary"
              aria-label="Back"
              onClick={() => history.goBack()}
            >
              <ArrowBack />
            </Button>
          </Grid>
          <Grid
            container={true}
            item={true}
            xs={12}
            sm={10}
            md={10}
            lg={10}
            xl={10}
            direction="row"
            alignItems="center"
            justify="center"
          >
            <span className={classes.title}>{translate(title)}</span>
            {tooltip && (
              <ClickAwayListener onClickAway={this.handleTooltipClose}>
                <Tooltip
                  TransitionComponent={Zoom}
                  classes={{ popper: classes.arrowPopper, tooltip: classes.tooltip }}
                  PopperProps={{
                    disablePortal: true
                  }}
                  onClose={this.handleTooltipClose}
                  open={tooltipOpen}
                  disableFocusListener={true}
                  disableHoverListener={true}
                  disableTouchListener={true}
                  placement="right"
                  title={
                    <React.Fragment>
                      {translate(tooltip)}
                      <span className={classes.arrowArrow} />
                    </React.Fragment>
                  }
                >
                  <IconButton onClick={this.handleTooltipToggle}>
                    <InfoOutlined color="primary" />
                  </IconButton>
                </Tooltip>
              </ClickAwayListener>
            )}
          </Grid>
          <Grid item={true} xs={false} sm={1} md={1} lg={1} xl={1} />
        </Grid>
        {children}
      </main>
    ) : (
      <div className="GenerateWallet Tab-content-pane">
        {children}
        <Link className="GenerateWallet-back" to="/generate">
          <i className="fa fa-arrow-left" /> {translate('MODAL_BACK')}
        </Link>
      </div>
    );
  }

  private handleTooltipClose = () => {
    this.setState({ tooltipOpen: false });
  };

  private handleTooltipToggle = () => {
    const { tooltipOpen } = this.state;
    this.setState({ tooltipOpen: !tooltipOpen });
  };
}

export default withStyles(styles)(withRouter(GenerateWalletTemplate)) as React.ComponentClass<
  OwnProps
>;
