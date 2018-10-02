import { IV3Wallet } from 'ethereumjs-wallet';
import React, { Component } from 'react';
import { generateKeystore } from 'libs/web-workers';
import Template from '../Template';
import DownloadWallet from './DownloadWallet';
import EnterPassword from './EnterPassword';
import PaperWallet from './PaperWallet';

export enum Steps {
  Password = 'password',
  Download = 'download',
  Paper = 'paper'
}

interface State {
  activeStep: Steps;
  password: string;
  keystore: IV3Wallet | null | undefined;
  filename: string;
  privateKey: string;
  isGenerating: boolean;
}

export default class GenerateKeystore extends Component<{}, State> {
  public state: State = {
    activeStep: Steps.Password,
    password: '',
    keystore: null,
    filename: '',
    privateKey: '',
    isGenerating: false
  };

  public componentDidMount() {
    this.generateWalletAndContinue('adsfadsfasdfadsf');
  }

  public render() {
    const { activeStep, keystore, privateKey, filename, isGenerating } = this.state;
    let content;

    switch (activeStep) {
      case Steps.Password:
        content = (
          <Template version={2} title="GENERATE_KEYSTORE_TITLE" tooltip="X_PASSWORDTOOLTIP">
            <EnterPassword continue={this.generateWalletAndContinue} isGenerating={isGenerating} />
          </Template>
        );
        break;

      case Steps.Download:
        if (keystore) {
          content = (
            <Template version={2} title="GEN_LABEL_2" tooltip="DL_WALLET_WARNING_4">
              <DownloadWallet
                keystore={keystore}
                filename={filename}
                continue={this.continueToPaper}
              />
            </Template>
          );
        }
        break;

      case Steps.Paper:
        if (keystore) {
          content = (
            <Template version={2} title="GEN_LABEL_5">
              <PaperWallet keystore={keystore} privateKey={privateKey} />
            </Template>
          );
        }
        break;

      default:
        content = <h1>Uh oh. Not sure how you got here.</h1>;
    }

    return content;
  }

  private generateWalletAndContinue = (password: string) => {
    this.setState({ isGenerating: true });

    generateKeystore(password).then(res => {
      this.setState({
        password,
        activeStep: Steps.Download,
        keystore: res.keystore,
        filename: res.filename,
        privateKey: res.privateKey,
        isGenerating: false
      });
    });
  };

  private continueToPaper = () => {
    this.setState({ activeStep: Steps.Paper });
  };
}
