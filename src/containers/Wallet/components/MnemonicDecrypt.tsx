import * as React from 'react';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import { green } from '@material-ui/core/colors';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid/Grid';
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment';
import IconButton from '@material-ui/core/IconButton/IconButton';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import Slide from '@material-ui/core/Slide/Slide';

interface OwnProps {
  onUnlock(param: any): void;
}

interface State {
  phrase: string;
  formattedPhrase: string;
  pass: string;
  seed: string;
  showPhrase: boolean;
  loading: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    hidden: {
      display: 'none'
    },
    formGrid: {
      marginTop: theme.spacing.unit * 5
    },
    fileNameLabel: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
      textAlign: 'center'
    },
    submitButton: {
      marginTop: theme.spacing.unit
    },
    passwordField: {
      marginTop: theme.spacing.unit * 4
    },
    wrapper: {
      margin: theme.spacing.unit,
      position: 'relative'
    },
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: 'calc(50% - 6px)',
      left: 'calc(50% - 12px)'
    },
    keyLabelIcon: {
      marginRight: theme.spacing.unit
    },
    keyLabel: {
      display: 'flex',
      alignItems: 'center'
    }
  });

interface Props extends OwnProps, WithStyles<typeof styles> {
}

class MnemonicDecryptClass extends React.Component<Props, State> {
  public state: State = {
    phrase: '',
    formattedPhrase: '',
    pass: '',
    seed: '',
    showPhrase: false,
    loading: false
  };

  public componentDidUpdate({}, prevState: State) {
    const { loading: prevLoading } = prevState;
    const { loading } = this.state;
    setTimeout(() => {
      loading !== prevLoading && this.onDWModalOpen();
    }, 500);
  }

  public render() {
    const { classes } = this.props;
    const { phrase, formattedPhrase, pass, showPhrase, loading } = this.state;
    // TODO: Validate Mnemonic
    console.log(formattedPhrase);
    const isValidMnemonic = false;

    return (
      <Slide in direction="left">
        <form onSubmit={this.handleSubmit}>
          <Grid
            container={true}
            justify="center"
            className={classes.formGrid}
            direction="column"
            alignItems="center"
          >
            <TextField
              value={phrase}
              name="phrase"
              fullWidth={true}
              type={showPhrase ? 'text' : 'password'}
              id="phrase"
              onChange={this.onMnemonicChange}
              label="Mnemonic"
              required={true}
              multiline={showPhrase}
              rows={3}
              error={phrase.length > 0 && !isValidMnemonic}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPhrase}
                    >
                      {showPhrase ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth={true}
              value={pass}
              name="password"
              className={classes.passwordField}
              type="password"
              id="password"
              onChange={this.onPasswordChange}
              label={pass ? 'Password' : 'Password (optional)'}
            />
            <div className={classes.wrapper}>
              <Button
                className={classes.submitButton}
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isValidMnemonic || loading}
              >
                Choose address
              </Button>
              {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
            </div>
          </Grid>
        </form>
        { /* TODO add select wallet modal */}
      </Slide>
    );
  }

  private handleClickShowPhrase = () => {
    const { showPhrase } = this.state;
    this.setState({ showPhrase: !showPhrase });
  };

  private onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ pass: e.currentTarget.value });
  };

  private onMnemonicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phrase = e.currentTarget.value;
    // TODO: Format Mnemonic
    console.log(phrase);
    const formattedPhrase = phrase.toString();

    this.setState({
      phrase,
      formattedPhrase
    });
  };

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState({ loading: true });
  };

  private onDWModalOpen = () => {
    const { formattedPhrase, pass } = this.state;

    console.log(formattedPhrase);
    console.log(pass);
    // TODO: Validate Mnemonic and return if false
    // if (!validateMnemonic(formattedPhrase)) {
    //   return;
    // }
    this.setState({ loading: true });

    try {
      // TODO: Make Mnemonic to Seed
      // const seed = mnemonicToSeed(formattedPhrase, pass).toString('hex');
      const seed = 'bla';
      this.setState({ seed });
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
    }
  };

  // private handleCancel = () => {
  //   this.setState({ seed: '', loading: false });
  // };

  // private handlePathChange = (dPath: DPath) => {
  //   this.setState({ dPath });
  // };

  // private handleUnlock = (address: string, index: number) => {
  //   const { formattedPhrase, pass, dPath } = this.state;
  //
  //   this.props.onUnlock({
  //     path: `${dPath.value}/${index}`,
  //     pass,
  //     phrase: formattedPhrase,
  //     address
  //   });
  //
  //   this.setState({
  //     seed: '',
  //     pass: '',
  //     phrase: '',
  //     formattedPhrase: ''
  //   });
  // };
}

export const MnemonicDecrypt = withStyles(styles)(MnemonicDecryptClass);
