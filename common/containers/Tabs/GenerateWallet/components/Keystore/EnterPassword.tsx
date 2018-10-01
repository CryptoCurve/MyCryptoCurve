import React, { Component } from 'react';
import zxcvbn, { ZXCVBNResult } from 'zxcvbn';
import translate, { translateRaw } from 'translations';
import { MINIMUM_PASSWORD_LENGTH } from 'config';
import './EnterPassword.scss';
import Grid from '@material-ui/core/Grid/Grid';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl/FormControl';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import Input from '@material-ui/core/Input/Input';
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment';
import IconButton from '@material-ui/core/IconButton/IconButton';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';
import Fade from '@material-ui/core/Fade/Fade';
import Button from '@material-ui/core/Button/Button';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { green } from '@material-ui/core/colors';

interface Props {
  isGenerating: boolean;

  continue(pw: string): void;
}

interface State {
  password: string;
  confirmedPassword: string;
  passwordValidation: ZXCVBNResult | null;
  feedback: string;
  showPassword: boolean;
  showConfirmedPassword: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    mainContentGrid: {
      marginTop: theme.spacing.unit * 5
    },
    layout: {
      width: 'auto',
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    },
    form: {
      width: '100%', // Fix IE11 issue.
      marginTop: theme.spacing.unit
    },
    submit: {
      marginTop: theme.spacing.unit * 3
    },
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%'
    },
    wrapper: {
      margin: theme.spacing.unit,
      position: 'relative'
    }
  });

class EnterPassword extends Component<Props & WithStyles<typeof styles>, State> {
  public state: State = {
    password: '',
    confirmedPassword: '',
    passwordValidation: null,
    feedback: '',
    showPassword: false,
    showConfirmedPassword: false
  };

  public render() {
    const { isGenerating, classes } = this.props;
    const {
      password,
      confirmedPassword,
      feedback,
      showPassword,
      showConfirmedPassword
    } = this.state;
    const passwordValidity = this.getPasswordValidity();
    const isPasswordValid = passwordValidity === 'valid';
    const isConfirmValid = confirmedPassword ? password === confirmedPassword : undefined;
    const canSubmit = isPasswordValid && isConfirmValid && !isGenerating;
    return (
      <Grid
        className={classes.mainContentGrid}
        container={true}
        direction="column"
        justify="space-evenly"
        alignItems="center"
        spacing={16}
      >
        <form className={classes.form} onSubmit={canSubmit ? this.handleSubmit : undefined}>
          <Grid container={true} className={classes.layout} justify="center" direction="row">
            <FormControl
              margin="normal"
              required={true}
              fullWidth={true}
              error={password.length > 0 && !isPasswordValid}
            >
              <InputLabel color="primary-text" htmlFor="password">
                {translate('INPUT_PASSWORD_LABEL')}
              </InputLabel>
              <Input
                value={password}
                name="password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                onChange={this.onPasswordChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword.bind(this, '')}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <Fade in={password.length > 0 && (!isPasswordValid || !!feedback)}>
                <FormHelperText id="component-error-text">
                  {feedback
                    ? feedback
                    : translateRaw('INPUT_PASSWORD_PLACEHOLDER', {
                        $pass_length: MINIMUM_PASSWORD_LENGTH.toString()
                      })}
                </FormHelperText>
              </Fade>
            </FormControl>
            <FormControl
              disabled={!isPasswordValid}
              margin="normal"
              required={true}
              fullWidth={true}
              error={confirmedPassword.length > 0 && !isConfirmValid}
            >
              <InputLabel color="primary-text" htmlFor="password">
                {translate('INPUT_CONFIRM_PASSWORD_LABEL')}
              </InputLabel>
              <Input
                value={confirmedPassword}
                name="confirmedPassword"
                type={showConfirmedPassword ? 'text' : 'password'}
                id="confirmedPassword"
                autoComplete="current-password"
                onChange={this.onConfirmChange}
                endAdornment={
                  <InputAdornment position="end">
                    <Fade in={isPasswordValid}>
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword.bind(this, 'confirm')}
                      >
                        {showConfirmedPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Fade>
                  </InputAdornment>
                }
              />
              <Fade in={confirmedPassword.length > 0 && true}>
                <FormHelperText id="component-error-text">
                  {isConfirmValid
                    ? translateRaw('GEN_PLACEHOLDER_1')
                    : translate('INPUT_CONFIRM_PASSWORD_NOT_MATCH')}
                </FormHelperText>
              </Fade>
            </FormControl>
            <div className={classes.wrapper}>
              <Button
                disabled={!canSubmit}
                type="submit"
                variant="raised"
                color="primary"
                className={classes.submit}
              >
                {translate('NAV_GENERATEWALLET')}
              </Button>
              {isGenerating && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
            {/*<p className="EnterPw-warning">{translate('X_PASSWORDDESC')}</p>*/}
          </Grid>
        </form>
      </Grid>
    );
  }

  private handleClickShowPassword = (which: string) => {
    which === 'confirm'
      ? this.setState(state => ({ showConfirmedPassword: !state.showConfirmedPassword }))
      : this.setState(state => ({ showPassword: !state.showPassword }));
  };

  private getPasswordValidity(): 'valid' | 'invalid' | 'semivalid' | undefined {
    const { password, passwordValidation } = this.state;

    if (!password) {
      return undefined;
    }

    if (password.length < MINIMUM_PASSWORD_LENGTH) {
      return 'invalid';
    }

    if (passwordValidation && passwordValidation.score < 3) {
      return 'semivalid';
    }

    return 'valid';
  }

  private getFeedback() {
    let feedback: string = '';
    const validity = this.getPasswordValidity();

    if (validity !== 'valid') {
      const { password, passwordValidation } = this.state;

      if (password.length < MINIMUM_PASSWORD_LENGTH) {
        feedback = translateRaw('INPUT_PASSWORD_PLACEHOLDER', {
          $pass_length: MINIMUM_PASSWORD_LENGTH.toString()
        });
      } else if (passwordValidation && passwordValidation.feedback) {
        feedback = translateRaw('WEAK_PASSWORD') + ' ' + passwordValidation.feedback.warning;
      } else {
        feedback = translateRaw('INVALID_PASSWORD');
      }
    }

    return feedback;
  }

  private handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    this.props.continue(this.state.password);
  };

  private onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.currentTarget.value;
    const passwordValidation = password ? zxcvbn(password) : null;

    this.setState(
      {
        password,
        passwordValidation,
        feedback: ''
      },
      () => {
        if (password.length >= MINIMUM_PASSWORD_LENGTH) {
          this.showFeedback();
        }
      }
    );
  };

  private onConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ confirmedPassword: e.currentTarget.value });
  };

  private showFeedback = () => {
    const { password, passwordValidation } = this.state;
    if (!password) {
      return;
    }

    const feedback = this.getFeedback();
    this.setState({ passwordValidation, feedback });
  };
}

export default withStyles(styles)(EnterPassword);
