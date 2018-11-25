import * as React from 'react';

interface RouteContextInterface {

}

const ctxt = React.createContext<RouteContextInterface | null>(null);

const RouteContextProvider = ctxt.Provider;

const RouteContextConsumer = ctxt.Consumer;

class RouteContext extends React.Component<{}, RouteContextInterface> {
  // noinspection JSUnusedGlobalSymbols
  public state = {};

  public render() {
    const { children } = this.props;
    return (
      <RouteContextProvider value={this.state}>
        {children}
      </RouteContextProvider>
    );
  }

}

export interface WithRouteContext {
  routeContext: RouteContextInterface;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function withRouteContext<P extends { routeContext?: RouteContextInterface },
  R = Omit<P, 'routeContext'>>(
  Component: React.ComponentClass<P> | React.StatelessComponent<P>
): React.SFC<R> {
  return function BoundComponent(props: R) {
    return (
      <RouteContextConsumer>
        {value => {
          return <Component {...props} routeContext={value}/>;
        }}
      </RouteContextConsumer>
    );
  };
}

export default RouteContext;
