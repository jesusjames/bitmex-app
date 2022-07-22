import PropTypes from 'prop-types';

const Header = ({ symbol, connected, closeConnection, avgSell, avgBuy }) => {
  return(
    <div className={'flex flex-row item-center justify-center'}>
      <div className={'flex w-2/12 item-center'}>
        <h2 className={'mr-1'}>{symbol}</h2>
        <h4 style={{ color: connected ? 'green' : 'orange' }}>{connected ? 'Conectado' : 'Desconectado'}</h4>
      </div>
      <div className={'flex w-3/12'}>
        <h3 className={'pr-1'}>Precio avg venta:</h3>
        <h3 style={{color: 'green'}}>{avgSell.toFixed(2)}</h3>
      </div>
      <div className={'flex w-3/12'}>
        <h3 className={'pr-1'}>Precio avg compra:</h3>
        <h3 style={{color: 'red'}}>{avgBuy.toFixed(2)}</h3>
      </div>
      <button className={'w-1/12'} onClick={closeConnection}>Cerrar conexión</button>
    </div>
  )
}

Header.propTypes = {
  symbol: PropTypes.string,
  connected: PropTypes.bool,
  closeConnection: PropTypes.func
}

export default Header;
