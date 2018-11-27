import * as React from 'react';
import Button from '@material-ui/core/Button/Button';
// import FormControl from '@material-ui/core/FormControl/FormControl';
// import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import Grid from '@material-ui/core/Grid/Grid';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
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
    }
  });

interface OwnProps {
  value: PrivateKeyValue;

  onChange(value: PrivateKeyValue): void;

  onUnlock(): void;
}
type Props = OwnProps & WithStyles<typeof styles>;

class PrivateKeyDecrypt extends React.Component<Props> {

  public render() {
    const { classes } = this.props;
    // const { key, password } = value;
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
          {/*<TextField*/}
            {/*label="To Address"*/}
            {/*value={toAddress}*/}
            {/*onChange={this.handleToAddressChange}*/}
            {/*margin="normal"*/}
            {/*fullWidth*/}
          {/*/>*/}
          {/*<FormControl margin="normal" fullWidth={true} error={false}>*/}
            {/*<InputLabel color="primary-text" htmlFor="pKey" className={classes.keyLabel}>*/}
              {/*<VPNKeyIcon className={classes.keyLabelIcon} /> Private Key*/}
            {/*</InputLabel>*/}
            {/*<Input*/}
              {/*error={key.length > 0 && !isValidPkey}*/}
              {/*value={key}*/}
              {/*type="text"*/}
              {/*id="pKey"*/}
              {/*autoComplete="current-password"*/}
              {/*onChange={this.onPkeyChange}*/}
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
            // disabled={unlockDisabled}
          >
            Unlock
          </Button>
        </Grid>
      </form>
    );
  }

  // private onPkeyChange = (e: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
  //   const pkey = e.currentTarget.value;
  //   const pass = this.props.value.password;
  //   const { fixedPkey, valid } = validatePkeyAndPass(pkey, pass);
  //
  //   this.props.onChange({ ...this.props.value, key: fixedPkey, valid });
  // };

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
