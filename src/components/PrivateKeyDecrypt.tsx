import * as React from 'react';
import Button from '@material-ui/core/Button/Button';
// import FormControl from '@material-ui/core/FormControl/FormControl';
// import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import Grid from '@material-ui/core/Grid/Grid';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import TextField from '@material-ui/core/TextField/TextField';
import { VPNKeyIcon } from '../theme/icons';
// import Input from '@material-ui/core/Input/Input';
// import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';
// import Fade from '@material-ui/core/Fade/Fade';
// import Grow from '@material-ui/core/Grow/Grow';
// import { VPNKeyIcon } from '../theme/icons';

export interface PrivateKeyValue {
  key: string;
  password: string;
  valid: boolean;
}

// interface Validated {
//   fixedPkey: string;
//   isValidPkey: boolean;
//   isPassRequired: boolean;
//   valid: boolean;
// }

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
      color: theme.palette.error.dark,
    }
  });

interface OwnProps {
  value: PrivateKeyValue;

  onChange(value: PrivateKeyValue): void;

  onUnlock(): void;
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
      valid: false
    }
  };

  public render() {
    const { classes } = this.props;
    const { pKeyValue } = this.state;
    const { key,valid } = pKeyValue;
    // const { isValidPkey, isPassRequired } = validatePkeyAndPass(key, password);
    // const unlockDisabled = !isValidPkey || (isPassRequired && !password.length);

    return (
      <form id="selectedTypeKey" onSubmit={this.unlock}>
        <Grid
          container={true}
          justify="center"
          className={classes.formGrid}
          direction="column"
          alignItems="center"
        >
          <TextField
            label={<React.Fragment><VPNKeyIcon className={classes.keyLabelIcon}/> Private Key</React.Fragment>}
            InputLabelProps={{ className: classes.keyLabel }}
            value={key}
            onChange={this.onPkeyChange}
            margin="normal"
            fullWidth
            error={key.length > 0 && !valid}
            helperText={(key.length > 0 && !valid)?<span className={classes.errorText}>Your wallet is encrypted. Please enter the password.</span>:undefined}
          />
          {/*<FormControl margin="normal" fullWidth={true} error={false}>*/}
          {/*<Input*/}
          {/*error={key.length > 0 && !isValidPkey}*/}
          {/*value={key}*/}
          {/*type="text"*/}
          {/*id="pKey"*/}
          {/*autoComplete="current-password"*/}
          {/*/>*/}
          {/*<Fade in={key.length > 0 && isValidPkey && isPassRequired}>*/}
          {/*<FormHelperText id="component-error-text">Your wallet is encrypted. Please enter the password.</FormHelperText>*/}
          {/*</Fade>*/}
          {/*</FormControl>*/}
          {/*{isValidPkey &&*/}
          {/*isPassRequired && (*/}
          {/*<Grow in={true}>*/}
          {/*<FormControl margin="normal" required={true} fullWidth={true} error={false}>*/}
          {/*<InputLabel color="primary-text" htmlFor="password">*/}
          {/*Password*/}
          {/*</InputLabel>*/}
          {/*<Input*/}
          {/*error={key.length > 0 && !isValidPkey}*/}
          {/*value={password}*/}
          {/*type="password"*/}
          {/*id="password"*/}
          {/*autoComplete="current-password"*/}
          {/*onChange={this.onPasswordChange}*/}
          {/*/>*/}
          {/*</FormControl>*/}
          {/*</Grow>*/}
          {/*)}*/}

          <Button
            className={classes.submitButton}
            type="submit"
            variant="contained"
            color="primary"
            disabled={!valid}
          >
            Unlock
          </Button>
        </Grid>
      </form>
    );
  }

  // private privateKeyHelperText = ()=> {
  //   const {pKeyValue} = this.state;
  //   const {key,valid} = pKeyValue;
  //   console.log(key,valid);
  //   return(
  //     <React.Fragment>
  //       <Fade in={key.length > 0 && !valid}>
  //         Your wallet is encrypted. Please enter the password.
  //       </Fade>
  //     </React.Fragment>
  //   )
  // };

  private onPkeyChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { pKeyValue } = this.state;
    const { password } = pKeyValue;
    const key = e.currentTarget.value;
    // TODO: Need to validate privateKey and password
    const valid = false;
    this.setState({
      pKeyValue: {
        key,
        password,
        valid
      }
    });
  };

  // private onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // NOTE: Textareas don't support password type, so we replace the value
  //   // with an equal length number of dots. On change, we replace
  //   const pkey = this.props.value.key;
  //   const pass = e.currentTarget.value;
  //   const { valid } = validatePkeyAndPass(pkey, pass);
  //
  //   this.props.onChange({
  //     ...this.props.value,
  //     password: pass,
  //     valid
  //   });
  // };

  private unlock = (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onUnlock();
  };
}

export default withStyles(styles)(PrivateKeyDecrypt);
