import { useCallback, useEffect, useRef, useState } from 'react';
import socket from '../socket';
import { ACTIONS } from '../constants';

let timeout;
export const useBitmexWs = () => {
  const [connected, setConnected] = useState(false);
  const [partial, setPartial] = useState([]);
  const queu = useRef([]);

  const deletePartial = useCallback((data) => {
    console.log('delete', data);
    const newPartial = [...partial];
    return newPartial.filter((partial) => {
      const itemExistsInPartial = data.some(item => partial.id === item.id);
      return !itemExistsInPartial;
    });
  }, [partial]);

  const insertPartial = useCallback((data) => {
    console.log('insert', data);
    const newPartial = [...partial];
    newPartial.unshift(...data);
    return newPartial;
  }, [partial]);

  const updatePartial = useCallback((data) => {
    console.log('update', data);
    const newPartial = [...partial];
    return newPartial.map((partial) => {
      const element = data.find(element => partial.id === element.id);
      return element ? {...partial, ...element} : partial;
    });
  }, [partial]);

  const closeConnection = () => {
    socket.close();
    if(timeout){
      clearTimeout(timeout);
    }
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

    socket.onmessage = (event) => {
      const responseData = JSON.parse(event.data);
      const { action, data, table } = responseData;
      if(action === ACTIONS.PARTIAL && table === "orderBookL2_25"){
        setPartial(data);
      }
      if((action === ACTIONS.DELETE || action === ACTIONS.INSERT || action === ACTIONS.UPDATE) && table === "orderBookL2_25") {
        enqueue(responseData);
      }
    };

    socket.onclose = () => {
      setConnected(false);
    };

    return () => {
      if(connected){
        socket.close();
      }
    }
  }, [connected]);

  useEffect(() => {
    timeout = setTimeout(() => {
      console.log('execute action message');
      const firstMessage = queu.current.shift();
      if(!firstMessage) return;
      const { action, data } = firstMessage;
      if(action === ACTIONS.DELETE && partial.length > 0) {
        const result = deletePartial(data);
        setPartial(result);
      }
      if(action === ACTIONS.INSERT && partial.length > 0) {
        const result = insertPartial(data);
        setPartial(result);
      }
      if(action === ACTIONS.UPDATE && partial.length > 0) {
        const result = updatePartial(data);
        setPartial(result);
      }
    }, 300);
    return () => {
      if(timeout){
        clearTimeout(timeout);
      }
    }
  }, [deletePartial, insertPartial, partial, updatePartial]);

  const enqueue = (message) => {
    queu.current.push(message);
  }

  return { connected, partial, closeConnection, changeSymbol, getAveragePrices};
}
