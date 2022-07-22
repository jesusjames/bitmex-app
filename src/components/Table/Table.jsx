import PropTypes from 'prop-types';

const Table = ({ children, columns, className, ...rest }) => {
  return(
    <table id={'price'} className={className} {...rest}>
      <thead>
        <tr>
          {
            columns.map((col) =>
              <th key={col}>{col}</th>
            )
          }
        </tr>
      </thead>
      <tbody>
      { children }
      </tbody>
    </table>
  )
}

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
  className: PropTypes.string
}

export default Table;
