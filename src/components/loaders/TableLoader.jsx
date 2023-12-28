import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TableLoader = ({ rows, columns }) => {
  return (
    <>
       {Array(rows)
        .fill()
        .map((row, rowIndex) => (
          <tr key={rowIndex}>
            {Array(columns)
              .fill()
              .map((column, columnIndex) => (
                <td key={columnIndex}>
                  <Skeleton />
                </td>
              ))}
          </tr>
        ))} 
    </>
  );
};

export default TableLoader;
