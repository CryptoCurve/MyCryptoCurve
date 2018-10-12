import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Option } from 'react-select';
import translate, { translateRaw } from 'translations';
import { isValidAddress } from 'libs/validators';
import { AddressOnlyWallet } from 'libs/wallet';
import { getRecentAddresses } from 'selectors/wallet';
import { AppState } from 'reducers';
import { Identicon } from 'components/ui';
import './ViewOnly.scss';
import Grid from '@material-ui/core/Grid/Grid';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import Typography from '@material-ui/core/Typography/Typography';
import FormControl from '@material-ui/core/FormControl/FormControl';
import Select from '@material-ui/core/Select/Select';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';

interface OwnProps {
  onUnlock(param: any): void;
}

interface StateProps {
  recentAddresses: AppState['wallet']['recentAddresses'];
}

interface State {
  address: string;
}

const styles = (theme: Theme) =>
  createStyles({
    spacer: {
      marginTop: theme.spacing.unit * 5
    },
    addressInput: {
      marginTop: theme.spacing.unit * 4
    },
    submitButton: {
      marginTop: theme.spacing.unit * 2
    }
  });

type Props = OwnProps & StateProps;

class ViewOnlyDecryptClass extends PureComponent<Props & WithStyles<typeof styles>, State> {
  public state = {
    address: ''
  };

  public render() {
    const { recentAddresses, classes } = this.props;
    const { address } = this.state;
    const isValid = isValidAddress(address);

    const recentOptions = (recentAddresses.map(addr => ({
      label: (
        <React.Fragment>
          <Identicon address={addr} />
          {addr}
        </React.Fragment>
      ),
      value: addr
      // I hate this assertion, but React elements definitely work as labels
    })) as any) as Option[];

    return (
      <React.Fragment>
        <form onSubmit={this.openWallet}>
          <Grid container={true} justify="center" direction="column" alignItems="center">
            {!!recentOptions.length && (
              <React.Fragment>
                <FormControl fullWidth={true} className={classes.spacer}>
                  <InputLabel htmlFor="selectName">{translateRaw('VIEW_ONLY_RECENT')}</InputLabel>
                  <Select
                    inputProps={{
                      name: 'selectName',
                      id: 'selectName',
                      onChange: this.handleSelectAddress
                    }}
                    value={address}
                    placeholder={translateRaw('VIEW_ONLY_RECENT')}
                  >
                    {recentAddresses.map(addr => (
                      <MenuItem key={addr} value={addr}>
                        <Grid container={true} direction="row" alignItems="center" spacing={8}>
                          <Grid item={true}>
                            <Identicon address={addr} />
                          </Grid>
                          <Grid item={true}>
                            <Typography variant="button">{addr}</Typography>
                          </Grid>
                        </Grid>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography className={classes.spacer} variant="button">
                  {translate('OR')}
                </Typography>
              </React.Fragment>
            )}
            <TextField
              className={classes.addressInput}
              value={address}
              label={translateRaw('VIEW_ONLY_ENTER_LABEL')}
              name="address"
              fullWidth={true}
              type="text"
              id="address"
              onChange={this.changeAddress}
              error={address.length > 0 && !isValid}
              placeholder={translateRaw('VIEW_ONLY_ENTER_PLACEHOLDER')}
            />
            <Button
              className={classes.submitButton}
              color="primary"
              variant="raised"
              disabled={!isValid}
            >
              {translate('VIEW_ADDR')}
            </Button>
          </Grid>
        </form>
      </React.Fragment>
    );
  }

  private changeAddress = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ address: ev.currentTarget.value });
  };

  private handleSelectAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const address = option && option.value ? option.value.toString() : '';
    const address = e.target.value;
    this.setState({ address }, () => this.openWallet());
  };

  private openWallet = (ev?: React.FormEvent<HTMLElement>) => {
    if (ev) {
      ev.preventDefault();
    }

    const { address } = this.state;
    if (isValidAddress(address)) {
      const wallet = new AddressOnlyWallet(address);
      this.props.onUnlock(wallet);
    }
  };
}

export const ViewOnlyDecrypt = withStyles(styles)(
  connect((state: AppState): StateProps => ({
    recentAddresses: getRecentAddresses(state)
  }))(ViewOnlyDecryptClass)
);
