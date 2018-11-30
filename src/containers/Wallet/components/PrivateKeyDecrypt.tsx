import * as React from 'react';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid/Grid';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import TextField from '@material-ui/core/TextField/TextField';
import { VPNKeyIcon } from '../../../theme/icons';
import Grow from '@material-ui/core/Grow/Grow';
import Slide from '@material-ui/core/Slide/Slide';

export interface PrivateKeyValue {
  key: string;
  password: string;
  isValidPkey: boolean;
  isValidPassword: boolean;
  isPasswordRequired: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    formGrid: {
      marginTop: theme.spacing.unit * 5
    },
    submitButton: {
      marginTop: theme.spacing.unit
    },
    keyLabelIcon: {
      marginRight: theme.spacing.unit
    },
    keyLabel: {
      display: 'flex',
      alignItems: 'center'
    },
    errorText: {
      color: theme.palette.error.dark
    }
  });

interface OwnProps {
  value: PrivateKeyValue;

  onUnlock(payload: PrivateKeyValue): void;
}

interface State {
  pKeyValue: PrivateKeyValue
}

type Props = OwnProps & WithStyles<typeof styles>;

class PrivateKeyDecrypt extends React.Component<Props, State> {

  public state = {
    pKeyValue: {
      key: '',
      password: '',
      isValidPkey: false,
      isValidPassword: false,
      isPasswordRequired: false
    }
  };

  public componentWillMount(): void {
    const { value } = this.props;
    this.setState({ pKeyValue: value });
  }

  public render() {
    const { classes } = this.props;
    const { pKeyValue } = this.state;
    const { key, isValidPkey, isPasswordRequired, password, isValidPassword } = pKeyValue;

    return (
      <Slide in direction="left">
        <form id="selectedTypeKey" onSubmit={this.unlock}>
          <Grid
            container={true}
            justify="center"
            className={classes.formGrid}
            direction="column"
            alignItems="center"
          >
            <TextField
              label={
                <React.Fragment>
                  <VPNKeyIcon className={classes.keyLabelIcon}/> Private Key
                </React.Fragment>}
              InputLabelProps={{ className: classes.keyLabel }}
              value={key}
              onChange={this.onChange('pKey')}
              margin="normal"
              fullWidth
              error={key.length > 0 && isValidPkey && isPasswordRequired && !isValidPassword}
              helperText={(key.length > 0 && isValidPkey && isPasswordRequired && !isValidPassword) ? <span
                className={classes.errorText}>Your wallet is encrypted. Please enter the password.</span> : undefined}
            />
            {isValidPkey &&
            isPasswordRequired && (
              <Grow in={true}>
                <TextField
                  label={'Password'}
                  value={password}
                  onChange={this.onChange('password')}
                  inputProps={{ type: 'password' }}
                  margin="normal"
                  fullWidth
                  error={password.length > 0 && !isValidPassword}
                  helperText={(password.length > 0 && !isValidPassword) ?
                    <span className={classes.errorText}>Invalid password provided</span> : undefined}
                />
              </Grow>
            )}

            <Button
              className={classes.submitButton}
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isValidPkey ||
              ((isPasswordRequired && !isValidPassword) || (!isPasswordRequired))}
            >
              Unlock
            </Button>
          </Grid>
        </form>
      </Slide>
    );
  }

  private onChange = (field: 'pKey' | 'password') => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { pKeyValue } = this.state;
    let { key, password } = pKeyValue;
    if (field === 'pKey') {
      key = e.currentTarget.value;
    } else {
      password = e.currentTarget.value;
    }
    // TODO: Need to validate privateKey and password
    // setting isValidPkey true for testing - should be changed
    const isValidPkey = key.length > 5;
    const isValidPassword = password.length > 5;
    const isPasswordRequired = true;
    this.setState({
      pKeyValue: {
        key,
        password,
        isValidPkey,
        isValidPassword,
        isPasswordRequired
      }
    });
  };

  private unlock = (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { pKeyValue } = this.state;
    this.props.onUnlock(pKeyValue);
  };
}

export default withStyles(styles)(PrivateKeyDecrypt);
