import { FormEvent, useState } from 'react';
import InputModal, { InputModalResult } from './input-modal';
import Select, { GroupBase, OptionsOrGroups } from 'react-select';

interface Item {
  value: number;
  label: string;
}

interface PropertySelectorProps {
  id: string;
  options: OptionsOrGroups<any, GroupBase<Item>>;
  value: any;
  title: string;
  caption: string;
  onChange: any;
  onCreate: any;
  buttonCaption?: string;
  allowAdd?: boolean;
  multiple?: boolean;
}

const PropertySelector = ({
  id,
  options,
  value,
  title,
  caption,
  onChange,
  onCreate,
  buttonCaption = 'Crear',
  allowAdd = false,
  multiple = false,
}: PropertySelectorProps) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const onCreateRequest = (event: FormEvent<HTMLButtonElement>): void => {
    event.preventDefault();

    setModalOpen(true);
  };

  const onModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <InputModal
        id={id}
        title={title}
        caption={caption}
        buttonCaption={buttonCaption}
        isOpen={isModalOpen}
        onReturn={(result: InputModalResult) => result.value && onCreate(result.value)}
        onClose={onModalClose}
      />
      <div className="input-group mb-3 flex-nowrap">
        <Select
          id={id}
          name={id}
          value={
            value?.find
              ? options.filter((option: any) => value.find((value: any) => value.id === option.value))
              : options.find((option) => option.value === value)
          }
          onChange={onChange}
          isMulti={multiple}
          options={options}
          isSearchable={false}
          isClearable={true}
          placeholder={<div>Seleccione...</div>}
          styles={{
            container: (prev: any) => ({ ...prev, width: '100%' }),
          }}
        />
        {allowAdd && (
          <div className="input-group-append">
            <button className="input-group-text" onClick={onCreateRequest}>
              <i className="fa fa-plus-circle" aria-hidden="true"></i>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PropertySelector;
