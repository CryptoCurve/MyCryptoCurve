import { isValidEncryptedPrivKey, isValidPrivKey } from 'libs/validators';
import { stripHexPrefix } from 'libs/values';
import React, { PureComponent } from 'react';
import translate, { translateRaw } from 'translations';
import Button from '@material-ui/core/Button/Button';
import FormControl from '@material-ui/core/FormControl/FormControl';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import Grid from '@material-ui/core/Grid/Grid';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import Input from '@material-ui/core/Input/Input';
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';
import Fade from '@material-ui/core/Fade/Fade';
import VPNKey from '@material-ui/icons/VpnKey';
import Grow from '@material-ui/core/Grow/Grow';

export interface PrivateKeyValue {
  key: string;
  password: string;
  valid: boolean;
}

interface Validated {
  fixedPkey: string;
  isValidPkey: boolean;
  isPassRequired: boolean;
  valid: boolean;
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
    }
  });

function validatePkeyAndPass(pkey: string, pass: string): Validated {
  const fixedPkey = stripHexPrefix(pkey).trim();
  const validPkey = isValidPrivKey(fixedPkey);
  const validEncPkey = isValidEncryptedPrivKey(fixedPkey);
  const isValidPkey = validPkey || validEncPkey;

  let isValidPass = false;

  if (validPkey) {
    isValidPass = true;
  } else if (validEncPkey) {
    isValidPass = pass.length > 0;
  }

  return {
    fixedPkey,
    isValidPkey,
    isPassRequired: validEncPkey,
    valid: isValidPkey && isValidPass
  };
}

interface Props {
  value: PrivateKeyValue;

  onChange(value: PrivateKeyValue): void;

  onUnlock(): void;
}

class PrivateKeyDecryptClass extends PureComponent<Props & WithStyles<typeof styles>> {
  public componentDidMount() {
    // setTimeout(() => this.props.onUnlock(), 500);
  }

  public render() {
    const { classes, value } = this.props;
    const { key, password } = value;
    const { isValidPkey, isPassRequired } = validatePkeyAndPass(key, password);
    const unlockDisabled = !isValidPkey || (isPassRequired && !password.length);

    return (
      <form id="selectedTypeKey" onSubmit={this.unlock}>
        <Grid
          container={true}
          justify="center"
          className={classes.formGrid}
          direction="column"
          alignItems="center"
        >
          <FormControl margin="normal" fullWidth={true} error={false}>
            <InputLabel color="primary-text" htmlFor="pKey" className={classes.keyLabel}>
              <VPNKey className={classes.keyLabelIcon} /> {translateRaw('X_PRIVKEY2')}
            </InputLabel>
            <Input
              error={key.length > 0 && !isValidPkey}
              value={key}
              type="text"
              id="pKey"
              autoComplete="current-password"
              onChange={this.onPkeyChange}
            />
            <Fade in={key.length > 0 && isValidPkey && isPassRequired}>
              <FormHelperText id="component-error-text">{translate('ADD_LABEL_3')}</FormHelperText>
            </Fade>
          </FormControl>
          {isValidPkey &&
            isPassRequired && (
              <Grow in={true}>
                <FormControl margin="normal" required={true} fullWidth={true} error={false}>
                  <InputLabel color="primary-text" htmlFor="password">
                    {translateRaw('INPUT_PASSWORD_LABEL')}
                  </InputLabel>
                  <Input
                    error={key.length > 0 && !isValidPkey}
                    value={password}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={this.onPasswordChange}
                  />
                </FormControl>
              </Grow>
            )}

          <Button
            className={classes.submitButton}
            type="submit"
            variant="raised"
            color="primary"
            disabled={unlockDisabled}
          >
            {translate('ADD_LABEL_6_SHORT')}
          </Button>
        </Grid>
      </form>
    );
  }

  private onPkeyChange = (e: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const pkey = e.currentTarget.value;
    const pass = this.props.value.password;
    const { fixedPkey, valid } = validatePkeyAndPass(pkey, pass);

    this.props.onChange({ ...this.props.value, key: fixedPkey, valid });
  };

  private onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // NOTE: Textareas don't support password type, so we replace the value
    // with an equal length number of dots. On change, we replace
    const pkey = this.props.value.key;
    const pass = e.currentTarget.value;
    const { valid } = validatePkeyAndPass(pkey, pass);

    this.props.onChange({
      ...this.props.value,
      password: pass,
      valid
    });
  };

  private unlock = (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onUnlock();
  };
}

export const PrivateKeyDecrypt = withStyles(styles)(PrivateKeyDecryptClass);
