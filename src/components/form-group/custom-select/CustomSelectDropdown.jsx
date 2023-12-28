/* eslint-disable no-dupe-keys */
import Select from 'react-select';
/**
 * custom styles configuration for react select
 */
const selectStyles = {
  control: (styles) => ({
    ...styles,
  }),
  option: (base) => ({
    ...base,
    cursor: 'pointer',
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
  }),
};

/**
 * custom configration to hide default sparator of react selete component
 */
const indicatorSeparatorStyle = {
  alignSelf: 'stretch',
  width: '0px',
};

const IndicatorSeparator = ({ innerProps }) => {
  return <span style={indicatorSeparatorStyle} {...innerProps} />;
};
/**
 *
 * @param {Object} value  selected value/values ,  i.g. { value:'',label: ''}
 * @param {Array} options  dropdown options list , i.g. [{ value:'',label: ''}]
 * @param {Function} onChange  onChange event function
 * @param {String} placeholder  input placeholder
 * @param {Boolean} isSearchable  prop to configure search functionality on dropdown
 * @param {Boolean} isMulti  prop to configure multi selection functionality
 * @param {String} className prop for custom css
 * @param {String} noOptionsMessage  prop to show no options message in option container
 * @param {Boolean} showCustomOptionsList prop to show custom options list
 * @param {Function} Option prop to render custom options list
 * @param {Boolean} isClearable prop to configure clearable functionality on single select
 * @param {Boolean} isDisabled prop to configure disabled dropdown
 * @returns custome react-select dropdown input component
 */
const CustomSelectDropdown = ({
  value = {},
  options = [],
  onChange = () => {},
  onBlur = () => {},
  placeholder = 'Select...',
  isSearchable = true,
  isMulti = false,
  className = '',
  noOptionsMessage = '',
  showCustomOptionsList = false,
  Option = () => {},
  isClearable = true,
  disabled = false,
  name = '',
  searchKey = [],
  isLoading = false,
}) => {
  function searchOption(option, searchText) {
    const searchTextLower = searchText.toLowerCase();
    if (searchKey?.length) {
      for (const key of searchKey) {
        const searchString = option?.data?.data?.[key] || '';
        if (
          searchString.toLowerCase().includes(searchTextLower) ||
          option.data.label?.toLowerCase().includes(searchTextLower)
        ) {
          return true;
        }
      }
      return false;
    }
    if (option.data.label?.toLowerCase().includes(searchTextLower)) {
      return true;
    }
    return false;
  }

  return (
    <Select
      value={value}
      blurInputOnSelect={false}
      options={options}
      onChange={(e) => onChange(e)}
      onBlur={(e) => onBlur(e)}
      name={name}
      components={
        showCustomOptionsList
          ? { IndicatorSeparator, Option }
          : { IndicatorSeparator }
      }
      placeholder={placeholder}
      isSearchable={isSearchable}
      isMulti={isMulti}
      isOptionDisabled={(option) => option.disabled}
      className={`${className}`}
      styles={selectStyles}
      noOptionsMessage={() => noOptionsMessage || 'No results found'}
      isClearable={isClearable}
      isDisabled={disabled}
      filterOption={searchOption}
      isLoading={isLoading}
    />
  );
};

export default CustomSelectDropdown;
