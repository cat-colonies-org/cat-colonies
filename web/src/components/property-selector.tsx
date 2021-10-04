import { FormEvent, useState } from 'react';
import InputModal, { InputModalResult } from './input-modal';
import Select, { GroupBase, OptionsOrGroups } from 'react-select';

interface Item {
  value: number;
  label: string;
}

interface PropertySelectorProps {
  id: string;
  items: OptionsOrGroups<any, GroupBase<Item>>;
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
  items,
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
          value={items.find((e) => e.value === value)}
          onChange={onChange}
          isMulti={multiple}
          options={items}
          isSearchable={false}
          isClearable={true}
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
