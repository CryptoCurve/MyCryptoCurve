import * as React from 'react';

interface DialogContextInterface {
  title: string;
  body: string;
  open: boolean;
  showDialog: () => void;
  hideDialog: () => void;
}

const ctxt = React.createContext<DialogContextInterface | null>(null);

const DialogContextProvider = ctxt.Provider;

const DialogContextConsumer = ctxt.Consumer;

class DialogContext extends React.Component<{}, DialogContextInterface> {
  // noinspection JSUnusedGlobalSymbols
  public state = {
    title: 'Place holder',
    body: 'Place holder',
    open: false,
    showDialog: () => {
      this.setState({ open: true });
    },
    hideDialog: () => this.setState({ open: false })
  };

  public render() {
    const { children } = this.props;
    return (
      <DialogContextProvider value={this.state}>
        {children}
      </DialogContextProvider>
    );
  }

}

export interface WithDialogContext {
  dialogContext: DialogContextInterface;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function withDialogContext<P extends { dialogContext?: DialogContextInterface },
  R = Omit<P, 'dialogContext'>>(
  Component: React.ComponentClass<P> | React.StatelessComponent<P>
): React.SFC<R> {
  return function BoundComponent(props: R) {
    return (
      <DialogContextConsumer>
        {value => {
          return <Component {...props} dialogContext={value}/>;
        }}
      </DialogContextConsumer>
    );
  };
}

export default DialogContext;
