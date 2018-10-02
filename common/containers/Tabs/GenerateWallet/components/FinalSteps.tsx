import React from 'react';
// import { Link } from 'react-router-dom';
import translate from 'translations';
import { WalletType } from '../GenerateWallet';
import OpenAppImage from 'assets/images/unlock-guide/open-app.png';
import OpenWebImage from 'assets/images/unlock-guide/open-web.png';
import TabAppImage from 'assets/images/unlock-guide/tab-app.png';
import TabWebImage from 'assets/images/unlock-guide/tab-web.png';
import SelectKeystoreImage from 'assets/images/unlock-guide/select-keystore.png';
import ProvideKeystoreImage from 'assets/images/unlock-guide/provide-keystore.png';
import SelectMnemonicImage from 'assets/images/unlock-guide/select-mnemonic.png';
import ProvideMnemonicImage from 'assets/images/unlock-guide/provide-mnemonic.png';
import './FinalSteps.scss';
import Grid from '@material-ui/core/Grid/Grid';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import Button from '@material-ui/core/Button/Button';
import { Link } from 'react-router-dom';

interface Props {
  walletType: WalletType;
}

const styles = (theme: Theme) =>
  createStyles({
    mainContentGrid: {
      marginTop: theme.spacing.unit * 5
    }
  });

const FinalSteps: React.SFC<Props & WithStyles<typeof styles>> = ({ walletType, classes }) => {
  const steps = [
    {
      name: translate('CREATE_FINAL_STEP_1'),
      image: process.env.BUILD_ELECTRON ? OpenAppImage : OpenWebImage
    },
    {
      name: translate('CREATE_FINAL_STEP_2'),
      image: process.env.BUILD_ELECTRON ? TabAppImage : TabWebImage
    }
  ];

  if (walletType === WalletType.Keystore) {
    steps.push({
      name: translate('CREATE_FINAL_STEP_3'),
      image: SelectKeystoreImage
    });
    steps.push({
      name: translate('CREATE_FINAL_STEP_4_KEYSTORE'),
      image: ProvideKeystoreImage
    });
  } else if (walletType === WalletType.Mnemonic) {
    steps.push({
      name: translate('CREATE_FINAL_STEP_3'),
      image: SelectMnemonicImage
    });
    steps.push({
      name: translate('CREATE_FINAL_STEP_4_MNEMONIC'),
      image: ProvideMnemonicImage
    });
  }
  return (
    <React.Fragment>
      <Grid
        className={classes.mainContentGrid}
        container={true}
        item={true}
        direction="row"
        justify="space-evenly"
        alignItems="center"
        spacing={16}
      >
        <Button
          component={(props: any) => <Link to="/account" {...props} />}
          variant="contained"
          color="primary"
        >
          {translate('GO_TO_ACCOUNT')}
        </Button>
      </Grid>
      {/*<div className="FinalSteps">*/}
      {/*<h1 className="FinalSteps-title">{translate('ADD_LABEL_6')}</h1>*/}
      {/*<div className="FinalSteps-buttons">*/}
      {/*<Link to="/account" className="FinalSteps-buttons-btn btn btn-primary btn-lg">*/}
      {/*{translate('GO_TO_ACCOUNT')}*/}
      {/*</Link>*/}
      {/*</div>*/}
      {/*</div>*/}
    </React.Fragment>
  );
};

export default withStyles(styles)(FinalSteps);
