import React from 'react';
import { SendButtonFactory } from './SendButtonFactory';
import translate from 'translations';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { SigningStatus } from 'components';
import './SendButton.scss';
import Button from '@material-ui/core/Button/Button';

export const SendButton: React.SFC<{
  className?: string;
  signing?: boolean;
  customModal?: typeof ConfirmationModal;
}> = ({ signing, customModal, className }) => (
  <React.Fragment>
    <SendButtonFactory
      signing={signing}
      Modal={customModal ? customModal : ConfirmationModal}
      withProps={({ disabled, openModal, signTx }) => {
        console.log(disabled);
        return (
          <React.Fragment>
            <Button
              color="primary"
              variant="contained"
              disabled={false}
              className={`SendButton btn btn-primary btn-block ${className}`}
              onClick={() => {
                signing ? (signTx(), openModal()) : openModal();
              }}
            >
              {translate('SEND_TRANS')}
            </Button>
          </React.Fragment>
        );
      }}
    />
    <SigningStatus />
  </React.Fragment>
);
