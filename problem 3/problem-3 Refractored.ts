interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain; //Added missing property (was being used but not typed)
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

//removed any Type
type Blockchain =
  | 'Osmosis'
  | 'Ethereum'
  | 'Arbitrum'
  | 'Zilliqa'
  | 'Neo';

interface Props extends BoxProps {}


//Moved outside component to avoid recreating on every render
//Replaced switch with lookup map (cleaner + avoids magic numbers scattered in logic)
const BLOCKCHAIN_PRIORITY: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: Blockchain): number => {
  return BLOCKCHAIN_PRIORITY[blockchain] ?? -99;
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;

  const balances = useWalletBalances();
  const prices = usePrices();

  /*
   * Fixed:
   * - Removed unused dependency (prices)
   * - Removed incorrect variable reference (lhsPriority)
   * - Compute priority once per balance
   * - Proper filter condition
   * - Proper sort comparator with full return path
   */
  const sortedBalances = React.useMemo(() => {
    return balances
      .map((balance) => ({
        ...balance,
        priority: getPriority(balance.blockchain), // compute once
      }))
      .filter(
        (balance) =>
          balance.priority > -99 && balance.amount > 0 // clearer filtering rule
      )
      .sort((a, b) => b.priority - a.priority); // stable numeric comparator
  }, [balances]);

  /*
   * Combine formatting + USD calculation in one pass
   * - Removed unused formattedBalances array
   * - Avoided double .map()
   */
  const rows = React.useMemo(() => {
    return sortedBalances.map((balance) => {
      const formattedAmount = balance.amount.toFixed(2);

      //Defensive check in case price is undefined
      const price = prices[balance.currency] ?? 0;
      const usdValue = price * balance.amount;

      return (
        <WalletRow
          className={classes.row}
          key={balance.currency} //Stable key (no index)
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={formattedAmount}
        />
      );
    });
  }, [sortedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};
