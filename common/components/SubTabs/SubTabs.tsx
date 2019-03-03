import React from 'react';
import Select, { Option } from 'react-select';
import { RouteComponentProps } from 'react-router-dom';
import './SubTabs.scss';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import Grid from '@material-ui/core/Grid/Grid';

export interface TabType {
  name: string | React.ReactElement<any>;
  path: string;
  disabled?: boolean;
  redirect?: string;
}

interface OwnProps {
  tabs: TabType[];
}

const styles = (theme: Theme) =>
  createStyles({
    tabsGrid: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2
    }
  });
type Props = OwnProps & RouteComponentProps<{}> & WithStyles<typeof styles>;

interface State {
  tabsWidth: number;
  isCollapsed: boolean;
  activeTab: number;
}

export default withStyles(styles)(
  class SubTabs extends React.PureComponent<Props, State> {
    public state: State = {
      tabsWidth: 0,
      isCollapsed: false,
      activeTab: 0
    };

    public componentDidMount() {
      // this.measureTabsWidth();
      // window.addEventListener('resize', this.handleResize);
    }

    public componentWillUnmount() {
      // window.removeEventListener('resize', this.handleResize);
    }

    // public componentWillReceiveProps(nextProps: Props) {
    // When new tabs come in, we'll need to uncollapse so that they can
    // be measured and collapsed again, if needed.
    // if (this.props.tabs !== nextProps.tabs) {
    //   this.setState({ isCollapsed: false });
    // }
    // }

    // public componentDidUpdate(prevProps: Props) {
    //   // New tabs === new measurements
    //   if (this.props.tabs !== prevProps.tabs) {
    //     this.measureTabsWidth();
    //   }
    // }

    public render() {
      const { tabs, classes } = this.props;
      const { isCollapsed, activeTab } = this.state;
      const currentPath = location.pathname;
      let content: React.ReactElement<string>;

      if (isCollapsed) {
        const options = tabs.map(tab => ({
          label: tab.name as string,
          value: tab.path,
          disabled: tab.disabled
        }));

        content = (
          <div className="SubTabs-select">
            <Select
              options={options}
              value={currentPath.split('/').pop()}
              onChange={this.handleSelect}
              searchable={false}
              clearable={false}
            />
          </div>
        );
      } else {
        // All tabs visible navigation
        content = (
          <React.Fragment>
            <Grid container={true} className={classes.tabsGrid}>
              <Tabs
                value={activeTab}
                indicatorColor="primary"
                textColor="primary"
                onChange={this.handleTabChange}
              >
                {tabs.map((t, i) => <Tab key={i} label={t.name} disabled={t.disabled} />)}
              </Tabs>
            </Grid>
          </React.Fragment>
        );
      }

      return <div className="SubTabs">{content}</div>;
    }

    private handleTabChange = ({}, value: number) => {
      const { tabs, history, match } = this.props;
      this.setState({ activeTab: value });
      history.push(`${match.url}/${tabs[value].path}`);
    };

    private handleSelect = ({ value }: Option) => {
      this.props.history.push(`${this.props.match.url}/${value}`);
    };

    // Tabs become a dropdown if they would wrap
    // private handleResize = () => {
    //   if (!this.containerEl) {
    //     return;
    //   }
    //
    //   this.setState({
    //     isCollapsed: this.state.tabsWidth >= this.containerEl.offsetWidth
    //   });
    // };

    // Store the tab width for future
    // private measureTabsWidth = () => {
    //   if (this.tabsEl) {
    //     this.setState({ tabsWidth: this.tabsEl.offsetWidth }, () => {
    //       this.handleResize();
    //     });
    //   } else {
    //     // Briefly show, measure, collapse again still not enough room
    //     this.setState({ isCollapsed: false }, this.measureTabsWidth);
    //   }
    // };
  }
);

// interface SubTabLinkProps {
//   tab: TabType;
//   basePath: string;
//   className: string;
//
//   onClick?(ev: React.MouseEvent<HTMLAnchorElement>): void;
// }

// const SubTabLink: React.SFC<SubTabLinkProps> = ({ tab, className, basePath, onClick }) => (
//   <NavLink
//     className={`${className} ${tab.disabled ? 'is-disabled' : ''}`}
//     activeClassName="is-active"
//     to={basePath + '/' + tab.path}
//     onClick={onClick}
//   >
//     {tab.name}
//   </NavLink>
// );
