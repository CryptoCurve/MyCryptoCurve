import * as Reactn from 'reactn';
import * as React from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import Button from '@material-ui/core/Button/Button';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import TextField from '@material-ui/core/TextField/TextField';

interface OwnProps {}

const styles = (theme: Theme) =>
  createStyles({
    containerGrid: {
      paddingLeft: theme.spacing.unit * 4,
      paddingRight: theme.spacing.unit * 20,
      display: 'flex',
      flex: 1
    },
    gridItem: {
      marginTop: theme.spacing.unit * 6
    }
  });
interface State {
  amount: number;
  toAddress: string;
}

type Props = OwnProps & WithStyles<typeof styles>;

class SendTransaction extends Reactn.Component<Props, State> {
  public state = {
    amount: 0,
    toAddress: ''
  };

  public render() {
    const { classes } = this.props;
    const { amount, toAddress } = this.state;
    console.log(this.global);
    return (
      <Grid container className={classes.containerGrid} direction="column" justify="flex-end">
        <Grid item className={classes.gridItem}>
          <TextField
            label="To Address"
            value={toAddress}
            onChange={this.handleToAddressChange}
            margin="normal"
            fullWidth
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <TextField
            label="Amount"
            inputProps={{ type: 'number', min: 0 }}
            value={amount}
            onChange={this.handleAmountChange}
            margin="normal"
            fullWidth
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <Button variant="raised" color="primary">
            Send Transaction
          </Button>
        </Grid>
      </Grid>
    );
  }

  private handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    this.setState({ amount: value === '' ? 0 : value });
  };

  private handleToAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    this.setState({ toAddress: value });
  };
}

// @ts-ignore
export default (withStyles(styles)(SendTransaction) as unknown) as React.ComponentClass<OwnProps>;
