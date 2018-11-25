import * as React from 'react';

export interface SnackBarMsg {
  message: string;
  key: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

export type SnackBarMessages = SnackBarMsg[];
interface SnackBarContextInterface {
  snackBarMessages: SnackBarMessages,
  snackBarPush:(snackBar:SnackBarMsg)=>void,
  snackBarShift: ()=>void
}

const ctxt = React.createContext<SnackBarContextInterface | null>(null);

const SnackBarContextProvider = ctxt.Provider;

const SnackBarContextConsumer = ctxt.Consumer;

class SnackBarContext extends React.Component<{},SnackBarContextInterface> {
  // noinspection JSUnusedGlobalSymbols
  public state = {
    snackBarMessages:[],
    snackBarPush: (snackBar:SnackBarMsg)=> {
      const tmpSnackBar:SnackBarMessages = this.state.snackBarMessages as SnackBarMessages;
      tmpSnackBar.push(snackBar);
      this.setState({snackBarMessages: tmpSnackBar})
    },
    snackBarShift: ()=> {
      const tmpSnackBar = this.state.snackBarMessages as SnackBarMessages;
      tmpSnackBar.shift();
      this.setState({snackBarMessages: tmpSnackBar})
    }
  };

  public render() {
    const {children} = this.props;
    return(
      <SnackBarContextProvider value={this.state}>
        {children}
      </SnackBarContextProvider>
    )
  }

}

export interface WithSnackBarContext {
  snackBarContext: SnackBarContextInterface;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function withSnackBarContext<
  P extends { snackBarContext?: SnackBarContextInterface },
  R = Omit<P, 'snackBarContext'>
  >(
  Component: React.ComponentClass<P> | React.StatelessComponent<P>
): React.SFC<R> {
  return function BoundComponent(props: R) {
    return (
      <SnackBarContextConsumer>
        {value => {
          return <Component {...props} snackBarContext={value}/>;
        }}
      </SnackBarContextConsumer>
    );
  };
}

export default SnackBarContext;
