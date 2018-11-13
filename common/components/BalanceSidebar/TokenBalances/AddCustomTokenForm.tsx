import React from 'react';
import { HELP_ARTICLE } from 'config';
import { isPositiveIntegerOrZero, isValidETHAddress } from 'libs/validators';
import translate, { translateRaw } from 'translations';
import { HelpLink } from 'components/ui';
import './AddCustomTokenForm.scss';
import { Token } from 'types/network';
import TextField from '@material-ui/core/TextField/TextField';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography/Typography';
import Grid from '@material-ui/core/Grid/Grid';
import Button from '@material-ui/core/Button/Button';
import { Colors } from '../../../Root';
import classnames from 'classnames';

interface Props {
  allTokens: Token[];

  onSave(params: Token): void;

  toggleForm(): void;
}

interface IGenerateSymbolLookup {
  [tokenSymbol: string]: boolean;
}

interface State {
  tokenSymbolLookup: IGenerateSymbolLookup;
  address: string;
  symbol: string;
  decimal: string;
}

const styles = (theme: Theme) =>
  createStyles({
    helperText: {
      marginTop: theme.spacing.unit
    },
    darkButtons: {
      backgroundColor: Colors.dark,
      color: Colors.white,
      '&:hover': {
        backgroundColor: Colors.darkHover
      }
    },
    topMargin: {
      marginTop: theme.spacing.unit
    },
    narrowButton: {
      minWidth: '100%'
    }
  });

export default withStyles(styles)(
  class AddCustomTokenForm extends React.PureComponent<Props & WithStyles<typeof styles>, State> {
    public state: State = {
      address: '',
      symbol: '',
      decimal: '',
      tokenSymbolLookup: this.generateSymbolLookup(this.props.allTokens)
    };

    public render() {
      const { address, symbol, decimal } = this.state;
      const { classes } = this.props;
      const errors = this.getErrors();

      const fields = [
        {
          name: 'symbol',
          value: symbol,
          label: translateRaw('TOKEN_SYMBOL')
        },
        {
          name: 'address',
          value: address,
          label: translateRaw('TOKEN_ADDR')
        },
        {
          name: 'decimal',
          value: decimal,
          label: translateRaw('TOKEN_DEC')
        }
      ];

      return (
        <form className="AddCustom" onSubmit={this.onSave}>
          {fields.map(field => {
            return (
              <React.Fragment key={field.name}>
                <TextField
                  type="text"
                  name={field.name}
                  value={field.value}
                  onChange={this.onFieldChange}
                  label={field.label}
                  error={!!errors[field.name]}
                  fullWidth={true}
                  helperText={typeof errors[field.name] === 'string' ? errors[field.name] : ''}
                />
              </React.Fragment>
            );
          })}

          <HelpLink article={HELP_ARTICLE.ADDING_NEW_TOKENS}>
            <Typography variant="body1" className={classes.helperText}>
              {translate('ADD_CUSTOM_TKN_HELP')}
            </Typography>
          </HelpLink>
          <Grid container={true} spacing={8} className={classes.topMargin}>
            <Grid item={true} xs={6}>
              <Button
                variant="contained"
                size="small"
                className={classnames(classes.darkButtons, classes.narrowButton)}
                onClick={this.props.toggleForm}
              >
                {translate('ACTION_2')}
              </Button>
            </Grid>
            <Grid item={true} xs={6}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="small"
                disabled={!this.isValid()}
                className={classes.narrowButton}
              >
                {translate('X_SAVE')}
              </Button>
            </Grid>
          </Grid>
        </form>
      );
    }

    public getErrors() {
      const { address, symbol, decimal } = this.state;
      const errors: { [key: string]: boolean | string } = {};

      // Formatting errors
      if (decimal && !isPositiveIntegerOrZero(parseInt(decimal, 10))) {
        errors.decimal = true;
      }
      if (address && !isValidETHAddress(address)) {
        errors.address = true;
      }

      // Message errors
      if (symbol && this.state.tokenSymbolLookup[symbol]) {
        errors.symbol = 'A token with this symbol already exists';
      }

      return errors;
    }

    public isValid() {
      const { address, symbol, decimal } = this.state;
      return !Object.keys(this.getErrors()).length && address && symbol && decimal;
    }

    public onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // TODO: change this to generic typescript
      const name = e.target.name;
      const value = e.target.value;
      console.log(name, value);
      this.setState({ [name]: value });
    };

    public onSave = (ev: React.FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      if (!this.isValid()) {
        return;
      }

      const { address, symbol, decimal } = this.state;
      this.props.onSave({ address, symbol, decimal: parseInt(decimal, 10) });
    };

    private generateSymbolLookup(tokens: Token[]) {
      return tokens.reduce(
        (prev, tk) => {
          prev[tk.symbol] = true;
          return prev;
        },
        {} as IGenerateSymbolLookup
      );
    }
  }
);
