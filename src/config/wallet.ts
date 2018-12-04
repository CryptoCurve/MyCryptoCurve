import { Chain } from '../context/WalletContext';

type ChainList = Chain[];

export const chainList:ChainList = [
  {
    name: "WanChain",
    value: "wan",
    defaultDerivationPath: ""
  },
  {
    name: "Ethereum",
    value: "eth",
    defaultDerivationPath: ""
  },
  {
    name: "AnotherChain",
    value: "rando",
    defaultDerivationPath: ""
  }
];
