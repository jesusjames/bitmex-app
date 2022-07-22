import { useCallback, useEffect, useState } from 'react';
import socket from '../socket';
import { ACTIONS } from '../constants';

export const useBitmexWs = () => {
  const [connected, setConnected] = useState(false);
  const [partial, setPartial] = useState([]);

  const deletePartial = useCallback((data) => {
    console.log('delete', data);
    const newPartial = [...partial];
    const result = newPartial.filter((partial) => {
      const itemExistsInPartial = data.some(item => partial.id === item.id);
      return !itemExistsInPartial;
    });
    return result;
  }, [partial]);

  const insertPartial = useCallback((data) => {
    console.log('insert', data);
    const newPartial = [...partial];
    newPartial.unshift(...data);
    return newPartial;
  }, [partial]);

  const updatePartial = (data, partial) => {
    const newPartial = [...partial];
    const result = [...newPartial].map((partial) => {
      const element = data.find(element => partial.id = element.id);
      return element ? element : partial;
    })
    return result;
  }

  const closeConnection = () => {
    socket.close();
  }

  const changeSymbol = (symbol = 'XBTUSD') => {
    if(connected){
      const msm = {op: 'subscribe', args: [`orderBookL2_25:${symbol}`]};
      socket.send(JSON.stringify(msm));
    }
  }

  const getAveragePrices = (partialData) => {
    const obj = [...partialData].reduce((prevValue, currentValue) => {
      prevValue[`pricePerSize${currentValue.side}`] = (currentValue.price * currentValue.size) + prevValue[`pricePerSize${currentValue.side}`];
      prevValue[`sumSize${currentValue.side}`] = currentValue.size + prevValue[`sumSize${currentValue.side}`];
      return prevValue;
    }, {pricePerSizeSell: 0, sumSizeSell: 0, pricePerSizeBuy: 0, sumSizeBuy: 0});

    return {
      avgPriceSell: obj.pricePerSizeSell / obj.sumSizeSell,
      avgPriceBuy: obj.pricePerSizeBuy / obj.sumSizeBuy
    }
  };

  useEffect(() => {
    socket.onopen = () => {
      console.log('CONNECTED');
      setConnected(true);
    };

    console.log('partial', partial);

    socket.onmessage = (event) => {
      const responseData = JSON.parse(event.data);
      const { action, data, table } = responseData;
      if(action === ACTIONS.PARTIAL && table === "orderBookL2_25"){
        setPartial(data);
      }
      if(action === ACTIONS.DELETE && partial.length > 0) {
        const result = deletePartial(data);
        setPartial(result);
      }
      if(action === ACTIONS.INSERT && partial.length > 0) {
        const result = insertPartial(data);
        setPartial(result);
      }
      /*if(action === ACTIONS.UPDATE && partial.length > 0) {
        const result = updatePartial(data);
        setPartial(result);
      }*/
    };

    socket.onclose = () => {
      setConnected(false);
    };
  }, [deletePartial, insertPartial, partial]);



  return { connected, partial, closeConnection, changeSymbol, getAveragePrices};
}
