import React from 'react';
import { connect } from 'react-redux';
import translate, { translateRaw } from 'translations';
import {
  getDeterministicWallets,
  GetDeterministicWalletsAction,
  GetDeterministicWalletsArgs,
  setDesiredToken,
  SetDesiredTokenAction
} from 'actions/deterministicWallets';
import { AppState } from 'reducers';
import { isValidPath } from 'libs/validators';
import { getNetworkConfig } from 'selectors/config';
import { getTokens, MergedToken } from 'selectors/wallet';
import { UnitDisplay } from 'components/ui';
import { StaticNetworkConfig } from 'types/network';
import './DeterministicWalletsModal.scss';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import FormControl from '@material-ui/core/FormControl/FormControl';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import Select from '@material-ui/core/Select/Select';
import Typography from '@material-ui/core/Typography/Typography';
import Grid from '@material-ui/core/Grid/Grid';
import IconButton from '@material-ui/core/IconButton/IconButton';
import TextField from '@material-ui/core/TextField/TextField';
import CheckIcon from '@material-ui/icons/Check';
import LaunchIcon from '@material-ui/icons/Launch';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { green } from '@material-ui/core/colors';
import { Colors } from '../../../Root';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableBody from '@material-ui/core/TableBody/TableBody';
import Radio from '@material-ui/core/Radio/Radio';

const WALLETS_PER_PAGE = 5;

interface Props {
  // Passed props
  isOpen: boolean;
  dPath: DPath;
  dPaths: DPath[];
  publicKey?: string;
  chainCode?: string;
  seed?: string;

  // Redux state
  wallets: AppState['deterministicWallets']['wallets'];
  desiredToken: AppState['deterministicWallets']['desiredToken'];
  network: StaticNetworkConfig;
  tokens: MergedToken[];

  // Redux actions
  getDeterministicWallets(args: GetDeterministicWalletsArgs): GetDeterministicWalletsAction;

  setDesiredToken(tkn: string | undefined): SetDesiredTokenAction;

  onCancel(): void;

  onConfirmAddress(address: string, addressIndex: number): void;

  onPathChange(dPath: DPath): void;
}

interface State {
  currentDPath: DPath;
  selectedAddress: string;
  selectedAddrIndex: number;
  isCustomPath: boolean;
  customPath: string;
  page: number;
}

const customDPath: DPath = {
  label: 'custom',
  value: 'custom'
};

const styles = (theme: Theme) =>
  createStyles({
    dialog: {
      width: '95%',
      height: '95%',
      borderRadius: theme.shape.borderRadius
    },
    dialogActions: {
      margin: theme.spacing.unit * 3
    },
    customPathTextField: {
      flex: 1,
      marginRight: theme.spacing.unit
    },
    customPathButton: {
      backgroundColor: green['500'],
      color: Colors.white,
      '&:hover': {
        backgroundColor: green['500']
      }
    },
    row: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default
      }
    },
    navButtons: {
      width: 'auto',
      height: 'auto',
      minWidth: 'auto',
      minHeight: 'auto'
    }
  });

class DeterministicWalletsModalClass extends React.PureComponent<
  Props & WithStyles<typeof styles>,
  State
> {
  public state: State = {
    selectedAddress: '',
    selectedAddrIndex: 0,
    isCustomPath: false,
    customPath: '',
    currentDPath: this.props.dPath,
    page: 0
  };

  public componentWillReceiveProps(nextProps: Props) {
    const { publicKey, chainCode, seed, dPath } = this.props;
    if (
      nextProps.publicKey !== publicKey ||
      nextProps.chainCode !== chainCode ||
      nextProps.dPath !== dPath ||
      nextProps.seed !== seed
    ) {
      this.getAddresses(nextProps);
    }
  }

  public render() {
    const { wallets, desiredToken, network, tokens, dPaths, onCancel, classes } = this.props;
    const { selectedAddress, customPath, page, currentDPath } = this.state;
    return (
      <Dialog
        onClose={onCancel}
        aria-labelledby="simple-dialog-title"
        open={this.props.isOpen}
        fullScreen={true}
        classes={{ paperFullScreen: classes.dialog }}
      >
        <DialogTitle>{translate('DECRYPT_DROPDOWN_LABEL')}</DialogTitle>
        <DialogContent>
          <form onSubmit={this.handleSubmitCustomPath}>
            <Grid container={true} spacing={8}>
              <Grid item={true} xs={12}>
                <FormControl fullWidth={true}>
                  <InputLabel htmlFor="fieldDPath">dPath</InputLabel>
                  <Select
                    inputProps={{
                      name: 'fieldDPath',
                      id: 'fieldDPath',
                      onChange: this.handleChangePath
                    }}
                    value={`${currentDPath.label}~${currentDPath.value}`}
                  >
                    {dPaths.concat([customDPath]).map((dPath, i) => (
                      <MenuItem key={i} value={`${dPath.label}~${dPath.value}`}>
                        <Grid container={true} direction="row" alignItems="center" spacing={8}>
                          <Grid item={true}>
                            <Typography variant="button">{dPath.label}</Typography>
                          </Grid>
                          {dPath.value !== 'custom' && (
                            <Grid item={true}>
                              <Typography variant="body2">( {dPath.value} )</Typography>
                            </Grid>
                          )}
                        </Grid>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {currentDPath.label === customDPath.label && (
                <Grid container={true} item={true} direction="row" xs={12}>
                  <TextField
                    value={customPath}
                    name="customPath"
                    type="text"
                    className={classes.customPathTextField}
                    onChange={this.handleChangeCustomPath}
                    label={translateRaw('DECRYPT_CUSTOM_PATH')}
                    error={customPath.length > 0 && !isValidPath(customPath)}
                    placeholder="m/44'/60'/0'/0"
                  />
                  <Button
                    variant="fab"
                    disabled={!isValidPath(customPath)}
                    type="submit"
                    classes={{ contained: classes.customPathButton }}
                  >
                    <CheckIcon />
                  </Button>
                </Grid>
              )}
            </Grid>
          </form>
          <Grid container={true} spacing={8}>
            <Grid item={true} xs={12}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>{network.unit}</TableCell>
                    <TableCell>
                      <FormControl fullWidth={true}>
                        <InputLabel htmlFor="token">Token</InputLabel>
                        <Select
                          inputProps={{
                            name: 'token',
                            id: 'token',
                            onChange: this.handleChangeToken
                          }}
                          value={desiredToken}
                        >
                          {tokens.map(t => (
                            <MenuItem key={t.symbol} value={t.symbol}>
                              {t.symbol}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>{translate('ACTION_5')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {wallets.map(wallet => {
                    const token = desiredToken ? wallet.tokenValues[desiredToken] : null;
                    return (
                      <TableRow
                        className={classes.row}
                        key={wallet.index}
                        onClick={this.selectAddress.bind(this, wallet.address, wallet.index)}
                        hover={true}
                      >
                        <TableCell>{wallet.index + 1}</TableCell>
                        <TableCell>
                          <Radio
                            checked={selectedAddress === wallet.address}
                            // onChange={this.handleChange}
                            value={wallet.address}
                            name="selectedAddress"
                          />
                          {wallet.address}
                        </TableCell>
                        <TableCell>
                          <UnitDisplay
                            unit={'ether'}
                            value={wallet.value}
                            symbol={network.unit}
                            displayShortBalance={true}
                            checkOffline={true}
                          />
                        </TableCell>
                        <TableCell>
                          {desiredToken ? (
                            <UnitDisplay
                              decimal={token ? token.decimal : 0}
                              value={token ? token.value : null}
                              symbol={desiredToken}
                              displayShortBalance={true}
                              checkOffline={true}
                            />
                          ) : (
                            <span className="DWModal-addresses-table-na">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <a
                            target="_blank"
                            href={`https://ethplorer.io/address/${wallet.address}`}
                            rel="noopener noreferrer"
                          >
                            <IconButton>
                              <LaunchIcon />
                            </IconButton>
                          </a>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Grid>
            <Grid container={true} item={true} alignItems="center" justify="flex-end" spacing={16}>
              <Grid item={true}>
                <Button
                  variant="fab"
                  size="small"
                  disabled={page === 0}
                  onClick={this.prevPage}
                  className={classes.navButtons}
                >
                  <ArrowBackIcon />
                </Button>
              </Grid>
              <Grid item={true}>
                <Button
                  variant="fab"
                  size="small"
                  className={classes.navButtons}
                  onClick={this.nextPage}
                >
                  <ArrowForwardIcon />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button onClick={onCancel} variant="contained">
            {translate('ACTION_2')}
          </Button>
          <Button
            disabled={!selectedAddress}
            onClick={this.handleConfirmAddress}
            color="primary"
            variant="contained"
          >
            {translate('ACTION_3')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private getAddresses(props: Props = this.props) {
    const { dPath, publicKey, chainCode, seed } = props;

    if (dPath && ((publicKey && chainCode) || seed)) {
      if (isValidPath(dPath.value)) {
        this.props.getDeterministicWallets({
          seed,
          publicKey,
          chainCode,
          dPath: dPath.value,
          limit: WALLETS_PER_PAGE,
          offset: WALLETS_PER_PAGE * this.state.page
        });
      } else {
        console.error('Invalid dPath provided', dPath);
      }
    }
  }

  private handleChangePath = (e: React.ChangeEvent<HTMLInputElement>) => {
    const genPath: string = e.target.value;
    const newPath: DPath = {
      label: genPath.split('~')[0],
      value: genPath.split('~')[1]
    };
    if (newPath.value === customDPath.value) {
      this.setState({ isCustomPath: true, currentDPath: newPath });
    } else {
      this.setState({ isCustomPath: false, currentDPath: newPath });
      this.props.onPathChange(newPath);
    }
  };

  private handleChangeCustomPath = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ customPath: ev.currentTarget.value });
  };

  private handleSubmitCustomPath = (ev: React.FormEvent<HTMLFormElement>) => {
    const { customPath, currentDPath } = this.state;
    ev.preventDefault();

    if (currentDPath.value === customDPath.value && isValidPath(customPath)) {
      this.props.onPathChange({
        label: customDPath.label,
        value: customPath
      });
    }
  };

  private handleChangeToken = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setDesiredToken(ev.target.value || undefined);
  };

  private handleConfirmAddress = () => {
    if (this.state.selectedAddress) {
      this.props.onConfirmAddress(this.state.selectedAddress, this.state.selectedAddrIndex);
    }
  };

  private selectAddress(selectedAddress: string, selectedAddrIndex: number) {
    this.setState({ selectedAddress, selectedAddrIndex });
  }

  private nextPage = () => {
    this.setState({ page: this.state.page + 1 }, this.getAddresses);
  };

  private prevPage = () => {
    this.setState({ page: Math.max(this.state.page - 1, 0) }, this.getAddresses);
  };
}

function mapStateToProps(state: AppState) {
  return {
    wallets: state.deterministicWallets.wallets,
    desiredToken: state.deterministicWallets.desiredToken,
    network: getNetworkConfig(state),
    tokens: getTokens(state)
  };
}

const DeterministicWalletsModal = withStyles(styles)(
  connect(mapStateToProps, {
    getDeterministicWallets,
    setDesiredToken
  })(DeterministicWalletsModalClass)
);

export default DeterministicWalletsModal;
