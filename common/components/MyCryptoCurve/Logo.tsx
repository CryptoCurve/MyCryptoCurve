import React from 'react';
import Typography from '@material-ui/core/Typography/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  grow: {
    flexGrow: 1
  }
};

interface StyleProps {
  classes: {
    grow: string;
  };
}

type Props = StyleProps;

const Logo = (props: Props) => {
  const { classes } = props;
  return (
    <Typography variant="headline" color="inherit" className={classes.grow}>
      MyCryptoCurve
    </Typography>
  );
};

export default withStyles(styles)(Logo);
