import React from 'react';
import { AmountFieldFactory } from './AmountFieldFactory';
import { UnitDropDown, SendEverything } from 'components';
import translate from 'translations';
import TextField from '@material-ui/core/TextField/TextField';

interface Props {
  hasUnitDropdown?: boolean;
  hasSendEverything?: boolean;
  showAllTokens?: boolean;

  customValidator?(rawAmount: string): boolean;
}

export const AmountField: React.SFC<Props> = ({
  hasUnitDropdown,
  hasSendEverything,
  showAllTokens,
  customValidator
}) => (
  <AmountFieldFactory
    withProps={({ currentValue: { raw }, isValid, onChange, readOnly }) => (
      <TextField
        fullWidth={true}
        label={translate('SEND_AMOUNT_SHORT')}
        type="number"
        InputProps={{
          readOnly: !!readOnly,
          endAdornment: (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {hasSendEverything ? <SendEverything /> : null}
              {hasUnitDropdown && <UnitDropDown showAllTokens={showAllTokens} />}
            </div>
          )
        }}
        spellCheck={false}
        onChange={onChange}
        error={isAmountValid(raw, customValidator, isValid)}
        placeholder="1"
        value={raw}
      />
    )}
  />
);

const isAmountValid = (
  raw: string,
  customValidator: ((rawAmount: string) => boolean) | undefined,
  isValid: boolean
) => (customValidator ? customValidator(raw) : isValid);
