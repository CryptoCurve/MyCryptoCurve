import * as React from 'react';
import Button from '@material-ui/core/Button/Button';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import { green } from '@material-ui/core/colors';
import Slide from '@material-ui/core/Slide/Slide';
import Grow from '@material-ui/core/Grow/Grow';
import TextField from '@material-ui/core/TextField/TextField';
import { WithSnackBarContext, withSnackBarContext } from '../../../context/SnackBarContext';

export interface KeystoreValue {
  file: string | null | ArrayBuffer;
  password: string;
  filename: string;
  valid: boolean;
}

function isPassRequired(file: string | null | ArrayBuffer): boolean {
  console.log(file);
  // TODO: communicate invalid file to user
  // TODO: Check whether file needs an password
  return !!file;
}

function isValidFile(rawFile: File): boolean {
  const fileType = rawFile.type;
  return fileType === '' || fileType === 'application/json';
}

interface OwnProps {
  value: KeystoreValue;

  onUnlock(payload: KeystoreValue): void;
}

interface State {
  keyStoreValue: KeystoreValue
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

type Props = OwnProps & WithStyles<typeof styles> & WithSnackBarContext;

class KeystoreDecryptClass extends React.Component<Props, State> {
  public state: State = {
    keyStoreValue: {
      filename: '',
      password: '',
      file: null,
      valid: false
    }
  };

  public componentWillMount(): void {
    const { value } = this.props;
    this.setState({ keyStoreValue: value });
  }

  public render() {
    const { classes } = this.props;
    const { keyStoreValue: { file, filename, password } } = this.state;
    const passReq = isPassRequired(file);
    const unlockDisabled = !file || (passReq && !password);

    return (
      <Slide in direction="left">
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
                Select File
              </Button>
            </label>
            <Typography className={classes.fileNameLabel} variant="body1">
              {filename}
            </Typography>
            {file &&
            passReq && (
              <Grow in={true}>
                <TextField
                  label={'Password'}
                  value={password}
                  onChange={this.onPasswordChange}
                  onKeyDown={this.onKeyDown}
                  inputProps={{ type: 'password' }}
                  margin="normal"
                  fullWidth
                  error={!!file && password.length === 0}
                />
              </Grow>
            )}
            <div className={classes.wrapper}>
              <Button
                className={classes.submitButton}
                type="submit"
                variant="contained"
                color="primary"
                disabled={unlockDisabled}
              >
                Unlock
              </Button>
            </div>
          </Grid>
        </form>
      </Slide>
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
    this.props.onUnlock(this.state.keyStoreValue);
  };

  private onPasswordChange = (e: any) => {
    const { file } = this.props.value;
    const valid = file !== null && file.toString().length && e.target.value.length;
    this.setState({
      keyStoreValue: {
        ...this.state.keyStoreValue,
        password: e.target.value,
        valid
      }
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

      this.setState({
        keyStoreValue: {
          ...this.state.keyStoreValue,
          file: keystore,
          valid: keystore !== null && keystore.toString().length !== 0 && !passReq,
          password: '',
          filename: fileName
        }
      });
      // this.props.onUnlock();
    };
    if (isValidFile(inputFile)) {
      fileReader.readAsText(inputFile, 'utf-8');
    } else {
      const {snackBarContext: {snackBarPush}} = this.props;
      snackBarPush({
        type: 'warning',
        message: "This is not a valid wallet file.",
        key: new Date().toString()
      });
    }
  };
}

export const KeystoreDecrypt = withStyles(styles)(withSnackBarContext(KeystoreDecryptClass)) as React.ComponentClass<OwnProps>;
