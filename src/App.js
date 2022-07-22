import './App.scss';
import { useBitmexWs } from './hooks/useBitmexWs';
import { useEffect, useState } from 'react';
import { Row, Table } from './components/Table';
import Header from './components/Header/Header';
import { SIDE } from './constants';

function App() {
  const [symbol, setSymbol] = useState('XBTUSD');
  const [avgPriceBuy, setAvgPriceBuy] = useState(0);
  const [avgPriceSell, setAvgPriceSell] = useState(0);
  const { closeConnection, connected, partial, getAveragePrices } = useBitmexWs();

  useEffect(() => {
    if(partial.length > 0) {
      const {avgPriceBuy, avgPriceSell} = getAveragePrices(partial);
      setAvgPriceSell(avgPriceSell);
      setAvgPriceBuy(avgPriceBuy);
    }
  }, [partial]);

  const hasPartialData = partial.length > 0;

  return (
    <div className="container">
      <Header symbol={symbol} connected={connected} closeConnection={closeConnection} avgSell={avgPriceSell} avgBuy={avgPriceBuy} />
      <div className={'flex flex-row item-center justify-center'}>
        {!hasPartialData && <h1>Cargando...</h1> }
        { hasPartialData &&
          <Table columns={['ID', 'Tipo', 'Tamaño', 'Precio']} className={'w-3/6'}>
            {
              partial.map(p => {
                const {id, side, size, price} = p;
                return <Row key={id} items={[id, side, size, price]}/>
              })
            }
          </Table>
        }
      </div>
    </div>
  );
}

export default App;
