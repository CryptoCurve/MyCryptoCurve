import React from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Badge from '@material-ui/core/Badge/Badge';
import Zoom from '@material-ui/core/Zoom/Zoom';

const styles = (theme: Theme) =>
  createStyles({
    wordContainer: {
      marginTop: theme.spacing.unit * 4
    },
    wordButtons: {
      backgroundColor: theme.palette.text.primary,
      color: theme.palette.text.secondary,
      minHeight: 40,
      fontSize: 20,
      minWidth: 210,
      '&:hover': {
        color: theme.palette.text.primary
      }
    },
    wordButtonsDisabled: {
      color: ['#fff', '!important'].join(' ')
    },
    wordButtonsConfirming: {
      border: ['solid', '2px', theme.palette.primary.main].join(' '),
      fontSize: 20,
      minHeight: 40,
      minWidth: 210
    },
    wordButtonsConfirmingDisabled: {
      color: [theme.palette.text.primary, '!important'].join(' ')
    },
    wordButtonsRevealed: {
      backgroundColor: ['#4CAF50', '!important'].join(' '),
      color: ['#fff', '!important'].join(' '),
      borderColor: '#4CAF50'
    },
    wordButtonsError: {
      backgroundColor: [theme.palette.error.main, '!important'].join(' '),
      color: ['#fff', '!important'].join(' '),
      borderColor: theme.palette.error.main
    },
    numberLabel: {
      paddingRight: 20,
      fontWeight: 600
    },
    badge: {
      top: -30,
      left: -10
    }
  });

interface Props {
  index: number;
  confirmIndex: number;
  word: string;
  value: string;
  showIndex: boolean;
  isNext: boolean;
  isBeingRevealed: boolean;
  isConfirming: boolean;
  hasBeenConfirmed: boolean;
  classes?: any;
  onClick(index: number, value: string): void;
}

interface State {
  flashingError: boolean;
}

class MnemonicWord extends React.Component<Props & WithStyles<typeof styles>, State> {
  public state = {
    flashingError: false
  };

  public render() {
    const {
      hasBeenConfirmed,
      isBeingRevealed,
      showIndex,
      index,
      isConfirming,
      confirmIndex,
      word,
      classes
    } = this.props;
    const { flashingError } = this.state;

    return (
      <Grid
        container={true}
        justify="center"
        direction="row"
        alignItems="center"
        item={true}
        className={classes.wordContainer}
      >
        {showIndex && (
          <Typography variant="subheading" color="textPrimary" className={classes.numberLabel}>
            {index + 1}.
          </Typography>
        )}
        <Zoom in={hasBeenConfirmed} style={{ zIndex: 1 }}>
          <Badge
            badgeContent={confirmIndex + 1}
            color="secondary"
            classes={{ badge: classes.badge }}
          >
            <div />
          </Badge>
        </Zoom>
        <Zoom in={true} timeout={{ enter: 200 + index * 100 }}>
          <Button
            className={isConfirming ? classes.wordButtonsConfirming : classes.wordButtons}
            classes={{
              disabled: isConfirming
                ? classes.wordButtonsConfirmingDisabled
                : classes.wordButtonsDisabled,
              root: isBeingRevealed
                ? classes.wordButtonsRevealed
                : flashingError ? classes.wordButtonsError : ''
            }}
            disabled={!isConfirming || hasBeenConfirmed}
            onClick={() => isConfirming && this.handleClick(word)}
          >
            {word}
          </Button>
        </Zoom>
      </Grid>
    );
  }

  private handleClick = (value: string) => {
    const { isNext, index, onClick } = this.props;

    if (!isNext) {
      this.flashError();
    }

    onClick(index, value);
  };

  private flashError = () => {
    const errorDuration = 200;

    this.setState(
      {
        flashingError: true
      },
      () =>
        setTimeout(
          () =>
            this.setState({
              flashingError: false
            }),
          errorDuration
        )
    );
  };
}

export default withStyles(styles)(MnemonicWord);
