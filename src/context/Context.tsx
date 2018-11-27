import * as React from 'react';
import { helperRenderConsoleText } from '../helpers/helpers';
import DialogContext from './DialogContext';
import RouteContext from './RouteContext';
import SnackBarContext from './SnackBarContext';
import WalletContext from './WalletContext';

interface OwnProps {}

type Props = OwnProps;

class Context  extends React.Component<Props> {
  public render() {
  console.log(...helperRenderConsoleText('Render Context', 'lightGreen'));
  const {children} = this.props;
    return (
      <DialogContext>
        <RouteContext>
          <SnackBarContext>
            <WalletContext>
              {children}
            </WalletContext>
          </SnackBarContext>
        </RouteContext>
      </DialogContext>
    );
  }
}

export default (Context) as React.ComponentClass<OwnProps>;
