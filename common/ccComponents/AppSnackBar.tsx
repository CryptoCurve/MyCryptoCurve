import * as Reactn from 'reactn';
import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import { SnackBarMsg, SnackBarState } from '../state';
import IconButton from '@material-ui/core/IconButton/IconButton';
import { CloseIcon } from '../ccTheme/icons';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import { amber, green } from '@material-ui/core/colors';
import SnackbarContent from '@material-ui/core/SnackbarContent/SnackbarContent';
import { renderConsoleText } from '../ccHelpers/helpers';

interface OwnProps {}

const styles = (theme: Theme) =>
  createStyles({
    close: {
      padding: theme.spacing.unit / 2
    },
    success: {
      backgroundColor: green['600']
    },
    warning: {
      backgroundColor: amber[700]
    },
    error: {
      backgroundColor: theme.palette.error.dark
    },
    info: {
      backgroundColor: theme.palette.primary.dark
    }
  });

interface State {
  open: boolean;
  messageInfo: SnackBarMsg;
}

type Props = OwnProps & WithStyles<typeof styles>;

class AppSnackBar extends Reactn.Component<Props, State> {
  public state = {
    open: false,
    messageInfo: {
      key: '',
      message: '',
      type: ''
    }
  };

  public queue: SnackBarState = [];

  public componentDidMount() {
    this.checkSnackBarQueue();
  }

  public componentWillUpdate() {
    this.checkSnackBarQueue();
  }

  public render() {
    const { open, messageInfo } = this.state;
    const { classes } = this.props;
    const { key, message, type } = messageInfo;
    console.log(...renderConsoleText('Render AppSnackBar', 'lightGreen'));

    return (
      <div>
        <Snackbar
          key={key}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          onExited={this.handleExited}
        >
          <SnackbarContent
            className={
              type === 'success'
                ? classes.success
                : type === 'warning'
                  ? classes.warning
                  : type === 'error' ? classes.error : classes.info
            }
            message={<span id="message-id">{message}</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        </Snackbar>
      </div>
    );
  }

  private checkSnackBarQueue = () => {
    const { open } = this.state;
    const snackBar: SnackBarState = this.global.snackBar;

    if (snackBar.length !== 0) {
      this.queue.push(snackBar[0]);
      this.global.snackBarShift();
      if (open) {
        // immediately begin dismissing current message
        // to start showing new one
        this.setState({ open: false });
      } else {
        this.processQueue();
      }
    }
    console.log(this.queue);
  };

  private processQueue = () => {
    if (this.queue.length > 0) {
      this.setState({
        messageInfo: this.queue.shift(),
        open: true
      });
    }
  };

  private handleClose = (e: any, reason?: string | undefined) => {
    if (e && reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

  private handleExited = () => {
    this.processQueue();
  };
}

// @ts-ignore
export default withStyles(styles)(AppSnackBar) as React.ComponentClass<OwnProps>;
