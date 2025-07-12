import { useParams } from "react-router-dom";
import CoinChart from "../Components/CoinChart/CoinChart";

const CoinDetail = ({ currency }) => {
  const { coinId } = useParams();

  return (
    <div className="p-4 md:p-8">
      <CoinChart coinId={coinId} currency={currency} />
    </div>
  );
};

export default CoinDetail;
