import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
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
import Hidden from '@material-ui/core/Hidden/Hidden';

interface OwnProps {
  children: React.ReactElement<any> | any;
  version?: number;
  title?: string;
  tooltip?: string;
  hideButton?: boolean;

  buttonAction?(): void;
}

const styles = (theme: Theme) =>
  createStyles({
    mainGrid: {
      marginTop: theme.spacing.unit * 10,
      marginBottom: theme.spacing.unit * 20,
      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing.unit * 10,
        marginBottom: theme.spacing.unit * 10,
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit
      }
    },
    layout: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flexGrow: 1
    },
    title: {
      ...theme.typography.title,
      textAlign: 'center'
    },
    buttonGridItem: {
      minHeight: 80,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonRow: {
      marginTop: theme.spacing.unit * 20,
      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing.unit * 5
      }
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
    const { children, history, classes, title, tooltip, hideButton, buttonAction } = this.props;
    const { tooltipOpen } = this.state;
    return (
      <React.Fragment>
        <Grid container={true} className={classes.mainGrid}>
          <Grid
            container={true}
            item={true}
            direction="row"
            justify="space-evenly"
            alignItems="center"
            spacing={16}
          >
            <Hidden smDown={true}>
              {!hideButton && (
                <Grid item={true} xs={12} md={2} className={classes.buttonGridItem}>
                  <Button
                    variant="fab"
                    color="primary"
                    aria-label="Back"
                    onClick={() => (buttonAction ? buttonAction() : history.push('/'))}
                  >
                    <ArrowBack />
                  </Button>
                </Grid>
              )}
            </Hidden>
            <Grid
              item={true}
              container={true}
              xs={12}
              md={hideButton ? 12 : 8}
              justify="center"
              alignItems="center"
            >
              <span className={classes.title}>{title ? translate(title) : ''}</span>
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
                        <Hidden smDown={true}>
                          <span className={classes.arrowArrow} />
                        </Hidden>
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
            {!hideButton && <Grid item={true} xs={12} md={2} />}
          </Grid>
          {children}
        </Grid>
      </React.Fragment>
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
