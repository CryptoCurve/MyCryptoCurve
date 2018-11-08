import * as Reactn from 'reactn';
import * as React from 'react';
import Grid from '@material-ui/core/Grid/Grid';

interface OwnProps {}

type Props = OwnProps;

class SendTransaction extends Reactn.Component<Props> {
  public render() {
    console.log(this.global);
    return (
      <Grid
        container
        style={{ display: 'flex', flex: 1, backgroundColor: 'salmon' }}
        direction="column"
        justify="flex-end"
      >
        <Grid item>Item 1</Grid>
        <Grid item>Item 2</Grid>
      </Grid>
    );
  }
}

export default (SendTransaction as unknown) as React.ComponentClass<OwnProps>;
