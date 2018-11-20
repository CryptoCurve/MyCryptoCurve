import * as React from 'react';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
// import BebasNeueBold from "./fonts/BebasNeueBold.ttf";

// @ts-ignore
const styles = (theme: Theme) =>
  createStyles({
    '@global': {
      a: {
        textDecoration: 'none'
      }
    }
    // '@font-face': [{
    //   fontFamily: 'Bebas Neue',
    //   src: `url(${require('./fonts/BebasNeueBold.woff')})`
    // }]

    // "@font-face": {
    //   fontFamily: "Bebas Neue Book",
    //   src: `url(./BebasNeueBook.ttf)`,
    // },
    // "@font-face": {
    //   "fontFamily": "Abel",
    //   src: `url(./Abel-Regular.ttf)`,
    // },
    //
    // "@font-face": {
    //   fontFamily: "Abel-Bold",
    //   src: `url(./abel-bold.otf)`
    // },
    //
    // },
  });

type Props = WithStyles<typeof styles>;

class CryptoCurveCss extends React.Component<Props> {
  public render() {
    return this.props.children || null;
  }
}

export default withStyles(styles, { name: 'CryptoCurveCss' })(
  CryptoCurveCss
) as React.ComponentClass<{}>;
