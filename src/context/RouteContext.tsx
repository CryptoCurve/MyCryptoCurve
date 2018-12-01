import * as React from 'react';

export type Routes = '' | 'wallet';

export interface RouteContextInterface {
  location: Routes;
  history: Routes[];
  navigateTo: (location: Routes) => () => void,
  navigateBack: () => void
}

const initialRoute = {
  location: "" as Routes
};

const ctxt = React.createContext<RouteContextInterface | null>(null);

const RouteContextProvider = ctxt.Provider;

const RouteContextConsumer = ctxt.Consumer;

class RouteContext extends React.Component<{}, RouteContextInterface> {
  // noinspection JSUnusedGlobalSymbols
  public state = {
    ...initialRoute,
    history: [],
    navigateTo: (location: Routes) => () => {
      const tmpHistory = this.state.history as Routes[];
      if (location !== this.state.location) {
        tmpHistory.push(location);
        this.setState({ history: tmpHistory, location });
      }
    },
    navigateBack: () => {
      const tmpHistory = this.state.history as Routes[];
      const tmpLocation = tmpHistory.length > 0 ? tmpHistory.shift() as Routes : null;
      if (tmpLocation !== null) {
        this.setState({ history: tmpHistory, location: tmpLocation });
      }
    }
  };

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
