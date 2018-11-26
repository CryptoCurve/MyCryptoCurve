import * as React from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import { helperRenderConsoleText } from '../helpers/helpers';
import { WithDialogContext, withDialogContext } from '../context/DialogContext';

interface OwnProps {}

type Props = OwnProps & WithDialogContext;

class AppDialog extends React.Component<Props> {

  public render() {
    console.log(...helperRenderConsoleText('Render AppDialog', 'lightGreen'));
    const { title, open, body } = this.props.dialogContext;
    return (
      <Dialog open={open}>
        <DialogTitle>{title}</DialogTitle>
        <div onClick={this.handleClick}>{body}</div>
      </Dialog>
    );
  }
  private handleClick = () => {
    const {hideDialog} = this.props.dialogContext;
    hideDialog();
  };
}

export default withDialogContext(AppDialog) as unknown as React.ComponentClass<OwnProps>;
