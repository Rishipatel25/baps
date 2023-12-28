import { FiSearch } from 'react-icons/fi';
import { MdOutlineClose } from 'react-icons/md';

export default function Search({
  placeholder,
  value,
  onChange,
  max_width,
  showBorder,
}) {
  return (
    <div
      className={`search-container d-relative  ${
        showBorder ? 'show-border' : ''
      }`}
      style={{
        maxWidth: max_width ? max_width : '100%',
        width: '100%',
      }}
    >
      <FiSearch className="search-icon" size={18} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e)}
      />
      {value && (
        <MdOutlineClose
          size={24}
          className="cursor-pointer close-icon"
          onClick={() => onChange({ target: { value: '' } })}
        />
      )}
    </div>
  );
}
