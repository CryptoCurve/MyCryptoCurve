import * as Reactn from 'reactn';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import * as React from 'react';
import { renderConsoleText } from '../helpers/helpers';

interface OwnProps {}

type Props = OwnProps;

class AppDialog extends Reactn.Component<Props> {
  public render() {
    console.log(...renderConsoleText('Render AppDialog', 'lightGreen'));
    const { title, open, body } = this.global.dialog;
    return (
      <Dialog open={open}>
        <DialogTitle>{title}</DialogTitle>
        <div onClick={this.handleClick}>{body}</div>
      </Dialog>
    );
  }
  private handleClick = () => {
    this.global.dialogClose();
  };
}

export default (AppDialog as unknown) as React.ComponentClass<OwnProps>;
