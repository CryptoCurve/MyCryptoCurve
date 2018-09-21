import React from 'react';
import Typography from '@material-ui/core/Typography/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';

const styles = {
  logoText: {
    fontSize: 26,
    marginBottom: 3,
    letterSpacing: 4.6
  },
  link: {
    color: '#ffffff',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
      color: '#ffffff'
    },
    '&:focus': {
      color: '#ffffff'
    }
  }
};

interface StyleProps {
  classes: {
    logoText: string;
    link: string;
  };
}

type Props = StyleProps;

const Logo = (props: Props) => {
  const { classes } = props;
  return (
    <Link to={'/'} className={classes.link}>
      <Typography variant="headline" color="inherit" className={classes.logoText}>
        MyCryptoCurve
      </Typography>
    </Link>
  );
};

export default withStyles(styles)(Logo);
