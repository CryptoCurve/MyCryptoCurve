import {
  closeNotification,
  Notification,
  NOTIFICATION_LEVEL,
  TCloseNotification
} from 'actions/notifications';
import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import NotificationRow from './NotificationRow';
import './Notifications.scss';
import { AppState } from 'reducers';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Theme, WithStyles } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import classnames from 'classnames';
import { amber, green } from '@material-ui/core/colors';
import SnackbarContent from '@material-ui/core/SnackbarContent/SnackbarContent';

interface State {
  open: boolean;
  key: number;
  message: ReactElement<any> | string;
  level: NOTIFICATION_LEVEL | null;
}

// interface OwnProps {}

interface StateProps {
  notifications: Notification[];
  closeNotification: TCloseNotification;
}

const styles = (theme: Theme) =>
  createStyles({
    close: {
      padding: theme.spacing.unit / 2
    },
    danger: {
      backgroundColor: theme.palette.error.dark
    },
    warning: {
      backgroundColor: amber[700]
    },
    success: {
      backgroundColor: green[600]
    },
    info: {
      backgroundColor: theme.palette.primary.dark
    }
  });

export class Notifications extends React.Component<
  {} & StateProps & WithStyles<typeof styles>,
  State
> {
  public queue: Notification[] = [];

  public state = {
    open: false,
    key: new Date().getTime(),
    message: '',
    level: null
  };

  public componentWillReceiveProps(nextProps: StateProps) {
    if (nextProps.notifications.length) {
      this.queue.push(nextProps.notifications[0]);
      nextProps.closeNotification(nextProps.notifications[0]);
    }
    this.setState({ open: !this.state.open });
  }

  public render() {
    const { classes } = this.props;
    const { key, open, message, level } = this.state;
    const classLevel: NOTIFICATION_LEVEL = level === null ? 'info' : level;
    return (
      <React.Fragment>
        <Snackbar
          key={key}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          onExited={this.handleExited}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
        >
          <SnackbarContent
            className={classnames(classes[classLevel])}
            message={<span id="message-id">{message}</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleClose.bind(this)}
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        </Snackbar>
        <TransitionGroup className="Notifications" aria-live="polite">
          {this.props.notifications.map(n => {
            return (
              <CSSTransition classNames="NotificationAnimation" timeout={500} key={n.id}>
                <NotificationRow notification={n} onClose={this.props.closeNotification} />
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </React.Fragment>
    );
  }

  // private handleClose (reason:any|null) {
  private handleClose = (...other: any[]) => {
    if (other[1] === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

  private handleExited = () => {
    this.processQueue();
  };

  private processQueue = () => {
    if (this.queue.length > 0) {
      this.setState({
        message: this.queue[0].msg,
        key: new Date().getTime(),
        open: true,
        level: this.queue[0].level
      });
      this.queue.shift();
    }
  };
}

const mapStateToProps = (state: AppState) => ({
  notifications: state.notifications
});

export default withStyles(styles)(
  connect(mapStateToProps, { closeNotification })(Notifications)
) as React.ComponentClass<{}>;
