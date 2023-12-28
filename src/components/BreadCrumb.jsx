import { usePathname } from 'next/navigation';

const BreadCrumb = () => {
  const path = usePathname();

  const formattedPath = path.split('/').map((segment, index, array) => (
    <span key={index} className='font-15'>
      {segment}
      {index < array.length - 1 ? ' / ' : ''}
    </span>
  ));

  return <strong>{formattedPath}</strong>;
};

export default BreadCrumb;
