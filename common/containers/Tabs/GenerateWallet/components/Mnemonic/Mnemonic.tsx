import React from 'react';
import { generateMnemonic } from 'bip39';
import translate from 'translations';
import shuffle from 'lodash/shuffle';
import Word from './Word';
import FinalSteps from '../FinalSteps';
import Template from '../Template';
import { WalletType } from '../../GenerateWallet';
import Grid from '@material-ui/core/Grid/Grid';
import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button/Button';
import Cached from '@material-ui/icons/Cached';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';

interface State {
  words: string[];
  confirmValues: string[];
  confirmWords: WordTuple[][];
  isConfirming: boolean;
  isConfirmed: boolean;
  isRevealingNextWord: boolean;
}

interface WordTuple {
  word: string;
  index: number;
}

const styles = (theme: Theme) =>
  createStyles({
    mainContentGrid: {
      marginTop: theme.spacing.unit * 5
    },
    buttonRow: {
      marginTop: theme.spacing.unit * 10
    },
    buttonIcon: {
      marginRight: theme.spacing.unit
    },
    regenButton: {
      border: ['solid', '2px', theme.palette.primary.main].join(' ')
    }
  });

interface StyleProps {
  classes: {
    mainContentGrid: string;
    buttonRow: string;
    buttonIcon: string;
    regenButton: string;
  };
}

type Props = StyleProps;

class GenerateMnemonic extends React.Component<Props, State> {
  public defaultProps = {
    classes: {}
  };

  public state: State = {
    words: [],
    confirmValues: [],
    confirmWords: [],
    isConfirming: false,
    isConfirmed: false,
    isRevealingNextWord: false
  };

  public componentDidMount() {
    this.regenerateWordArray();
  }

  public render() {
    const { classes } = this.props;
    const { words, confirmWords, isConfirming, isConfirmed } = this.state;
    const canContinue = this.checkCanContinue();
    const [firstGroup, secondGroup, thirdGroup] =
      confirmWords.length === 0 ? this.splitWordsIntoGroups(words, 3) : confirmWords;

    const content = isConfirmed ? (
      <FinalSteps walletType={WalletType.Mnemonic} />
    ) : (
      <React.Fragment>
        <Grid
          className={classes.mainContentGrid}
          container={true}
          direction="row"
          justify="space-evenly"
          alignItems="center"
          spacing={16}
        >
          {[firstGroup, secondGroup, thirdGroup].map((ws, i) => (
            <Grid container={true} key={i} lg={4} md={4} sm={12} xs={12} xl={4}>
              {ws.map(this.makeWord)}
            </Grid>
          ))}
          <Grid
            className={classes.buttonRow}
            container={true}
            direction="row"
            justify="center"
            alignItems="center"
            spacing={40}
          >
            {!isConfirming && (
              <Grid item={true}>
                <Button className={classes.regenButton} onClick={this.regenerateWordArray}>
                  <Cached className={classes.buttonIcon} />
                  {translate('REGENERATE_MNEMONIC')}
                </Button>
              </Grid>
            )}
            {isConfirming && (
              <Grid item={true}>
                <Button
                  className={classes.regenButton}
                  disabled={canContinue}
                  onClick={this.revealNextWord}
                >
                  <RemoveRedEye className={classes.buttonIcon} />
                  {translate('REVEAL_NEXT_MNEMONIC')}
                </Button>
              </Grid>
            )}
            <Grid item={true}>
              <Button
                variant="contained"
                color="primary"
                disabled={!canContinue}
                onClick={this.goToNextStep}
              >
                {translate('CONFIRM_MNEMONIC')}
              </Button>
            </Grid>
          </Grid>

          {/*<button  onClick={()=>this.setState({ isConfirmed: true })} >skip</button>*/}
        </Grid>
      </React.Fragment>
    );
    console.log('isConfirmed', isConfirmed);
    console.log('isConfirming', isConfirming);
    console.log(
      isConfirming ? 'MNEMONIC_DESCRIPTION_2' : isConfirmed ? '' : 'MNEMONIC_DESCRIPTION_1'
    );
    return (
      <Template
        version={2}
        title={isConfirmed ? 'ADD_LABEL_6' : 'GENERATE_MNEMONIC_TITLE'}
        tooltip={
          isConfirmed ? '' : isConfirming ? 'MNEMONIC_DESCRIPTION_2' : 'MNEMONIC_DESCRIPTION_1'
        }
      >
        {content}
      </Template>
    );
  }

  private regenerateWordArray = () => {
    this.setState({ words: generateMnemonic().split(' ') });
  };

  private goToNextStep = () => {
    if (!this.checkCanContinue()) {
      return;
    }

    if (this.state.isConfirming) {
      this.setState({ isConfirmed: true });
    } else {
      const shuffledWords = shuffle(this.state.words);
      const confirmWords = this.splitWordsIntoGroups(shuffledWords, 3);

      this.setState({
        isConfirming: true,
        confirmWords
      });
    }
  };

  private checkCanContinue = () => {
    const { isConfirming, words, confirmValues } = this.state;

    if (isConfirming) {
      return words.reduce((prev, word, index) => {
        return word === confirmValues[index] && prev;
      }, true);
    } else {
      return !!words.length;
    }
  };

  private makeWord = (word: WordTuple) => {
    const { words, confirmValues, isRevealingNextWord, isConfirming } = this.state;
    const confirmIndex = words.indexOf(word.word);
    const nextIndex = confirmValues.length;
    const isNext = confirmIndex === nextIndex;
    const isRevealed = isRevealingNextWord && isNext;
    const hasBeenConfirmed = this.getWordConfirmed(word.word);

    return (
      <Word
        key={`${word.word}${word.index}`}
        index={word.index}
        confirmIndex={confirmIndex}
        word={word.word}
        value={confirmValues[word.index] || ''}
        showIndex={!isConfirming}
        isNext={isNext}
        isBeingRevealed={isRevealed}
        isConfirming={isConfirming}
        hasBeenConfirmed={hasBeenConfirmed}
        onClick={this.handleWordClick}
      />
    );
  };

  private handleWordClick = (_: number, value: string) => {
    const { confirmValues: previousConfirmValues, words, isConfirming } = this.state;
    const wordAlreadyConfirmed = previousConfirmValues.includes(value);
    const activeIndex = previousConfirmValues.length;
    const isCorrectChoice = words[activeIndex] === value;

    if (isConfirming && !wordAlreadyConfirmed && isCorrectChoice) {
      const confirmValues = previousConfirmValues.concat(value);

      this.setState({ confirmValues });
    }
  };

  private getWordConfirmed = (word: string) => this.state.confirmValues.includes(word);

  private revealNextWord = () => {
    const revealDuration = 400;

    this.setState(
      {
        isRevealingNextWord: true
      },
      () =>
        setTimeout(
          () =>
            this.setState({
              isRevealingNextWord: false
            }),
          revealDuration
        )
    );
  };

  private splitWordsIntoGroups = (words: string[], groups: 1 | 2 | 3 = 2) => {
    const first: WordTuple[] = [];
    const second: WordTuple[] = [];
    const third: WordTuple[] = [];

    words.forEach((word: string, index: number) => {
      const inFirstColumn = index < words.length / groups;
      const half = inFirstColumn
        ? first
        : groups > 2 && index < words.length / groups * 2 ? second : third;
      half.push({ word, index });
    });

    return [first, second, third];
  };
}

export default withStyles(styles)(GenerateMnemonic);
