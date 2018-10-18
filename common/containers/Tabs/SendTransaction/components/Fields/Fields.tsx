import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isAnyOfflineWithWeb3 } from 'selectors/derived';
import {
  AddressField,
  AmountField,
  TXMetaDataPanel,
  CurrentCustomMessage,
  GenerateTransaction,
  SendButton,
  SchedulingToggle,
  ScheduleFields,
  GenerateScheduleTransactionButton,
  SendScheduleTransactionButton
} from 'components';
import { OnlyUnlocked, WhenQueryExists } from 'components/renderCbs';
import translate from 'translations';

import { AppState } from 'reducers';
import { getOffline, getNetworkConfig } from 'selectors/config';
import { getCurrentSchedulingToggle, ICurrentSchedulingToggle } from 'selectors/schedule/fields';
import { getUnit } from 'selectors/transaction';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid/Grid';

const QueryWarning: React.SFC<{}> = () => (
  <WhenQueryExists
    whenQueryExists={
      <div className="alert alert-info">
        <p>{translate('WARN_SEND_LINK')}</p>
      </div>
    }
  />
);

interface StateProps {
  schedulingAvailable: boolean;
  shouldDisplay: boolean;
  offline: boolean;
  useScheduling: ICurrentSchedulingToggle['value'];
}

const styles = (theme: Theme) =>
  createStyles({
    containerGrid: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2
    }
  });

class FieldsClass extends Component<StateProps & WithStyles<typeof styles>> {
  public render() {
    const { shouldDisplay, schedulingAvailable, useScheduling, classes } = this.props;

    return (
      <OnlyUnlocked
        whenUnlocked={
          <React.Fragment>
            <QueryWarning />
            {shouldDisplay && (
              <React.Fragment>
                <Grid
                  container={true}
                  spacing={16}
                  direction="column"
                  className={classes.containerGrid}
                >
                  <Grid item={true}>
                    <AddressField />
                  </Grid>
                  <Grid item={true}>
                    <AmountField hasUnitDropdown={true} hasSendEverything={true} />
                    {schedulingAvailable && (
                      <div className="col-sm-3 col-md-2">
                        <SchedulingToggle />
                      </div>
                    )}
                  </Grid>
                  <Grid item={true}>
                    {useScheduling && <ScheduleFields />}

                    <div className="row form-group">
                      <div className="col-xs-12">
                        <TXMetaDataPanel scheduling={useScheduling} />
                      </div>
                    </div>
                  </Grid>
                  <Grid item={true}>
                    <CurrentCustomMessage />

                    {this.getTxButton()}
                  </Grid>
                </Grid>
              </React.Fragment>
            )}
          </React.Fragment>
        }
      />
    );
  }

  private getTxButton() {
    const { offline, useScheduling } = this.props;

    if (useScheduling) {
      if (offline) {
        return <GenerateScheduleTransactionButton />;
      }

      return <SendScheduleTransactionButton signing={true} />;
    }

    if (offline) {
      return <GenerateTransaction />;
    }

    return <SendButton signing={true} />;
  }
}

export const Fields = withStyles(styles)(
  connect((state: AppState) => ({
    schedulingAvailable: getNetworkConfig(state).name === 'Kovan' && getUnit(state) === 'ETH',
    shouldDisplay: !isAnyOfflineWithWeb3(state),
    offline: getOffline(state),
    useScheduling: getCurrentSchedulingToggle(state).value
  }))(FieldsClass)
) as React.ComponentClass<{}>;
