import * as Reactn from 'reactn';
import * as React from 'react';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import { customStyles } from '../../../../ccTheme/theme';
import { IconArrowForward } from '../../../../ccTheme/icons';

interface OwnProps {}

interface State {}

const styles = (theme: Theme) => {
  console.log(theme.mixins.gutters());
  return createStyles({
    subSection: {
      marginTop: theme.spacing.unit * 6
    },
    subSectionContent: {
      marginTop: theme.spacing.unit * 2
    },
    buttonEndIconSpacing: customStyles.buttonEndIconSpacing
  });
};

type Props = OwnProps & WithStyles<typeof styles>;

class SubMenu extends Reactn.Component<Props, State> {
  public state = {};

  public render() {
    console.log('Render SubMenu');
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div className={classes.subSection}>
          <Typography variant="title">Token Balances</Typography>
          <div className={classes.subSectionContent}>
            <Button variant="raised" color="primary">
              Scan for Tokens
            </Button>
          </div>
        </div>
        <div className={classes.subSection}>
          <Typography variant="title">Account Address</Typography>
          <div className={classes.subSectionContent}>
            <Typography variant="body1">0x26D1804db95c3E71db834632D807CBe51938e774</Typography>
          </div>
        </div>
        <div className={classes.subSection}>
          <Typography variant="title">Account Balance</Typography>
          <div className={classes.subSectionContent}>
            <Typography variant="body1">1,326.26 WAN</Typography>
          </div>
        </div>
        <div className={classes.subSection}>
          <Button variant="raised" color="primary">
            View Transaction History
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

// @ts-ignore
export default (withStyles(styles)(SubMenu) as unknown) as React.ComponentClass<OwnProps>;
