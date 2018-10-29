import React from 'react';
import { AddressFieldFactory } from './AddressFieldFactory';
import { donationAddressMap } from 'config';
import translate from 'translations';
import TextField from '@material-ui/core/TextField/TextField';

const sdk = require('cryptocurve-sdk');

interface Props {
  isReadOnly?: boolean;
  isSelfAddress?: boolean;
  isCheckSummed?: boolean;
}

export const AddressField: React.SFC<Props> = ({ isReadOnly, isSelfAddress, isCheckSummed }) => (
  <AddressFieldFactory
    isSelfAddress={isSelfAddress}
    withProps={({ currentTo, isValid, onChange, readOnly }) => (
      <React.Fragment>
        <TextField
          fullWidth={true}
          label={translate(isSelfAddress ? 'X_ADDRESS' : 'SEND_ADDR')}
          value={isCheckSummed ? sdk.utils.eth.toChecksumAddress(currentTo.raw) : currentTo.raw}
          type="text"
          placeholder={donationAddressMap.ETH}
          InputProps={{ readOnly: isReadOnly || readOnly }}
          spellCheck={false}
          onChange={onChange}
          error={!!currentTo.raw.length && !isValid}
        />
      </React.Fragment>
    )}
  />
);
