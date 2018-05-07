import React from 'react';
import { NewTabLink } from 'components/ui';
import './index.scss';

const SUBJECT = 'Error!';
const DESCRIPTION =
  'I encountered an error while using MyCrypto. Here are the steps to re-create the issue:\n\nThe full error message:';

interface Props {
  error: Error;
}

const ErrorScreen: React.SFC<Props> = ({ error }) => {
  return (
    <div className="ErrorScreen">
      <div className="ErrorScreen-content">
        <p>
          Please contact{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`mailto:support@cryptocurve.io?Subject=${SUBJECT}&body=${DESCRIPTION}`}
            style={{ color: 'black' }}
          >
            support@cryptocurve.io
          </a>{' '}
        </p>
        <code>{error.message}</code>
        <h5>Please make sure the error message does not include any sensitive information.</h5>
      </div>
    </div>
  );
};

export default ErrorScreen;
