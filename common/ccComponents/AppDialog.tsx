import * as Reactn from 'reactn';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import * as React from 'react';

interface OwnProps {}

type Props = OwnProps;

class AppDialog extends Reactn.Component<Props> {
  public render() {
    console.log('Render AppDialog');
    const { title, open } = this.global.dialog;
    return (
      <Dialog open={open}>
        <DialogTitle>{title}</DialogTitle>
        <div onClick={this.handleClick}>This will be the body</div>
      </Dialog>
    );
  }
  private handleClick = () => {
    this.global.dialogToggleOpen();
  };
}

export default (AppDialog as unknown) as React.ComponentClass<OwnProps>;