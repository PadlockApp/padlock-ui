import Web3 from 'web3';

const toBN = Web3.utils.toBN;

export class Eth {
  static isValidAddress = (address: string) => Web3.utils.isAddress(address);

  static toChecksumAddress = (address: string) =>
    Web3.utils.toChecksumAddress(address);

  static addressesAreEqual = (...args: string[]): boolean => {
    if (args.length === 1) {
      return true;
    } else if (args.length === 2) {
      return (
        Web3.utils.toChecksumAddress(args[0]) ===
        Web3.utils.toChecksumAddress(args[1])
      );
    } else {
      return (
        Eth.addressesAreEqual(args[0], args[1]) &&
        Eth.addressesAreEqual(...args.slice(1))
      );
    }
  };

  static isValidNumber = (number: number) => number && !isNaN(number);

  static toEthUnits = (num: number, decimals = 18) => {
    const s = '' + num;
    const base = s.split('.')[1]
      ? s.split('.')[0] + s.split('.')[1]
      : s.split('.')[0];
    const exp = s.split('.')[1] ? s.split('.')[1].length : 0;
    return toBN(base).mul(toBN(10).pow(toBN(decimals - exp)));
  };

  static toNumberUnits = (num: number, decimals = 18) => {
    return Number(num / 10 ** decimals).toFixed(2);
  };

  static toFmtNumber = (num: number) => {
    return Number(num)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };
}
