import { mnemonicToSeed, validateMnemonic } from 'bip39';
import React, { PureComponent } from 'react';
import translate, { translateRaw } from 'translations';
import DeterministicWalletsModal from './DeterministicWalletsModal';
import { formatMnemonic } from 'utils/formatters';
import { InsecureWalletName } from 'config';
import { AppState } from 'reducers';
import { connect } from 'react-redux';
import { getSingleDPath, getPaths } from 'selectors/config/wallet';
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

interface OwnProps {
  onUnlock(param: any): void;
}

interface StateProps {
  dPath: DPath;
  dPaths: DPath[];
}

interface State {
  phrase: string;
  formattedPhrase: string;
  pass: string;
  seed: string;
  dPath: DPath;
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

type Props = OwnProps & StateProps & WithStyles<typeof styles>;

class MnemonicDecryptClass extends PureComponent<Props, State> {
  public state: State = {
    phrase: 'monkey clock pool orbit sleep what wheat evoke pond smart find easily',
    formattedPhrase: 'monkey clock pool orbit sleep what wheat evoke pond smart find easily',
    pass: '',
    seed: '',
    dPath: this.props.dPath,
    showPhrase: false,
    loading: false
  };

  public componentDidMount() {
    this.onDWModalOpen();
  }
  public componentDidUpdate({}, prevState: State) {
    const { loading: prevLoading } = prevState;
    const { loading } = this.state;
    setTimeout(() => {
      loading && loading !== prevLoading && this.onDWModalOpen();
    }, 500);
  }
  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.dPath !== nextProps.dPath) {
      this.setState({ dPath: nextProps.dPath });
    }
  }

  public render() {
    const { classes } = this.props;
    const { phrase, formattedPhrase, seed, dPath, pass, showPhrase, loading } = this.state;
    const isValidMnemonic = validateMnemonic(formattedPhrase);

    return (
      <React.Fragment>
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
              label={translateRaw('X_MNEMONIC')}
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
                      {showPhrase ? <VisibilityOff /> : <Visibility />}
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
              label={translateRaw(pass ? 'INPUT_PASSWORD_LABEL' : 'ADD_LABEL_8')}
            />
            <div className={classes.wrapper}>
              <Button
                className={classes.submitButton}
                type="submit"
                variant="raised"
                color="primary"
                disabled={!isValidMnemonic || loading}
              >
                {translate('MNEMONIC_CHOOSE_ADDR')}
              </Button>
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
          </Grid>
        </form>
        <DeterministicWalletsModal
          isOpen={!!seed}
          seed={seed}
          dPath={dPath}
          dPaths={this.props.dPaths}
          onCancel={this.handleCancel}
          onConfirmAddress={this.handleUnlock}
          onPathChange={this.handlePathChange}
        />
      </React.Fragment>
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
    const formattedPhrase = formatMnemonic(phrase);

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

    if (!validateMnemonic(formattedPhrase)) {
      return;
    }
    this.setState({ loading: true });

    try {
      const seed = mnemonicToSeed(formattedPhrase, pass).toString('hex');
      this.setState({ seed });
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
    }
  };

  private handleCancel = () => {
    this.setState({ seed: '', loading: false });
  };

  private handlePathChange = (dPath: DPath) => {
    this.setState({ dPath });
  };

  private handleUnlock = (address: string, index: number) => {
    const { formattedPhrase, pass, dPath } = this.state;

    this.props.onUnlock({
      path: `${dPath.value}/${index}`,
      pass,
      phrase: formattedPhrase,
      address
    });

    this.setState({
      seed: '',
      pass: '',
      phrase: '',
      formattedPhrase: ''
    });
  };
}

function mapStateToProps(state: AppState): StateProps {
  return {
    // Mnemonic dPath is guaranteed to always be provided
    dPath: getSingleDPath(state, InsecureWalletName.MNEMONIC_PHRASE) as DPath,
    dPaths: getPaths(state, InsecureWalletName.MNEMONIC_PHRASE)
  };
}

export const MnemonicDecrypt = withStyles(styles)(connect(mapStateToProps)(MnemonicDecryptClass));
