import PropTypes from 'prop-types';

const Row = ({ items, className, rest }) => {
 return(
   <tr className={className} {...rest}>
     {
       items.map((item, index) =>
         <td key={index}>{item}</td>
       )
     }
   </tr>
 )
}

Row.propTypes = {
  items: PropTypes.array,
  className: PropTypes.string
}

export default Row;
