import PropTypes from 'prop-types';

const Header = ({ symbol, connected, closeConnection, avgSell, avgBuy }) => {
  return(
    <div className={'flex flex-col sm:flex-row sm:flex-wrap item-center justify-center w-full'}>
      <div className={'flex w-full sm:w-full lg:w-2/12 item-center justify-center'}>
        <h2 className={'mr-1'}>{symbol}</h2>
        <h4 style={{ color: connected ? 'green' : 'orange' }}>{connected ? 'Conectado' : 'Desconectado'}</h4>
      </div>
      <div className={'flex w-full sm:w-6/12 lg:w-4/12 item-center justify-center'}>
        <h3 className={'pr-1'}>Precio avg venta:</h3>
        <h3 style={{color: 'green'}}>{avgSell.toFixed(2)}</h3>
      </div>
      <div className={'flex w-full sm:w-6/12 lg:w-4/12 item-center justify-center'}>
        <h3 className={'pr-1'}>Precio avg compra:</h3>
        <h3 style={{color: 'red'}}>{avgBuy.toFixed(2)}</h3>
      </div>
      <button className={'h-full w-5/12 sm:w-3/12 lg:w-2/12 my-1'} onClick={closeConnection}>Cerrar conexión</button>
    </div>
  )
}

Header.propTypes = {
  symbol: PropTypes.string,
  connected: PropTypes.bool,
  closeConnection: PropTypes.func
}

export default Header;
