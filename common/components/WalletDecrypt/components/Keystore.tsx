import { isKeystorePassRequired } from 'libs/wallet';
import * as React from 'react';
import translate, { translateRaw } from 'translations';
import { TShowNotification } from 'actions/notifications';
import Button from '@material-ui/core/Button/Button';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import FormControl from '@material-ui/core/FormControl/FormControl';
import Input from '@material-ui/core/Input/Input';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { green } from '@material-ui/core/colors';

export interface KeystoreValue {
  file: string;
  password: string;
  filename: string;
  valid: boolean;
}

function isPassRequired(file: string): boolean {
  let passReq = false;
  try {
    passReq = isKeystorePassRequired(file);
  } catch (e) {
    // TODO: communicate invalid file to user
  }
  return passReq;
}

function isValidFile(rawFile: File): boolean {
  const fileType = rawFile.type;
  return fileType === '' || fileType === 'application/json';
}

interface OwnProps {
  value: KeystoreValue;
  isWalletPending: boolean;
  isPasswordPending: boolean;

  onChange(value: KeystoreValue): void;

  onUnlock(): void;

  showNotification(level: string, message: string): TShowNotification;
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
    wrapper: {
      margin: theme.spacing.unit,
      position: 'relative'
    },
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: 'calc(50% - 6px)',
      left: 'calc(50% - 12px)'
    }
  });

class KeystoreDecryptClass extends React.Component<OwnProps & WithStyles<typeof styles>> {
  public render() {
    const { isWalletPending, value: { file, password, filename }, classes } = this.props;
    const passReq = isPassRequired(file);
    const unlockDisabled = !file || (passReq && !password);

    return (
      <form onSubmit={this.unlock}>
        <Grid
          container={true}
          justify="center"
          className={classes.formGrid}
          direction="column"
          alignItems="center"
        >
          <input
            style={{ display: 'none' }}
            type="file"
            id="fselector"
            onChange={this.handleFileSelection}
          />
          <label htmlFor="fselector">
            <Button component="span" variant="outlined" color="primary">
              {translate('ADD_RADIO_2_SHORTER')}
            </Button>
          </label>
          <Typography className={classes.fileNameLabel} variant="body1">
            {filename}
          </Typography>
          <FormControl margin="normal" required={true} fullWidth={true} error={false}>
            <InputLabel color="primary-text" htmlFor="password">
              {translate('INPUT_PASSWORD_LABEL')}
            </InputLabel>
            <Input
              error={!!file && password.length === 0}
              disabled={!file}
              value={password}
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={this.onPasswordChange}
              onKeyDown={this.onKeyDown}
            />
          </FormControl>
          <div className={classes.wrapper}>
            <Button
              className={classes.submitButton}
              type="submit"
              variant="raised"
              color="primary"
              disabled={unlockDisabled || isWalletPending}
            >
              {translate('ADD_LABEL_6_SHORT')}
            </Button>
            {isWalletPending && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </Grid>
      </form>
    );
  }

  private onKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      this.unlock(e);
    }
  };

  private unlock = (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onUnlock();
  };

  private onPasswordChange = (e: any) => {
    const valid = this.props.value.file.length && e.target.value.length;
    this.props.onChange({
      ...this.props.value,
      password: e.target.value,
      valid
    });
  };

  private handleFileSelection = (e: any) => {
    const fileReader = new FileReader();
    const target = e.target;
    const inputFile = target.files[0];
    const fileName = inputFile.name;

    fileReader.onload = () => {
      const keystore = fileReader.result;
      const passReq = isPassRequired(keystore);

      this.props.onChange({
        ...this.props.value,
        file: keystore,
        valid: keystore.length && !passReq,
        password: '',
        filename: fileName
      });
      this.props.onUnlock();
    };
    if (isValidFile(inputFile)) {
      fileReader.readAsText(inputFile, 'utf-8');
    } else {
      this.props.showNotification('danger', translateRaw('ERROR_3'));
    }
  };
}

export const KeystoreDecrypt = withStyles(styles)(KeystoreDecryptClass) as React.ComponentClass<
  OwnProps
>;
