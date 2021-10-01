import { FormEvent, useState } from 'react';
import InputModal, { InputModalResult } from './input-modal';

interface Item {
  id: number;
}

interface PropertySelectorProps {
  id: string;
  items: Item[];
  value: any;
  setter: any;
  textGetter: any;
  title: string;
  caption: string;
  buttonCaption: string;
  factory: any;
  onCreate: any;
  onError: any;
}

const PropertySelector = ({
  id,
  items,
  value,
  setter,
  textGetter,
  title,
  caption,
  buttonCaption,
  factory,
  onCreate,
  onError,
}: PropertySelectorProps) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const onSelectChange = (event: FormEvent<HTMLSelectElement>): void => {
    setter((prev: any) => {
      return { ...prev, [event.currentTarget.id]: +event.currentTarget.value };
    });
  };

  const onCreateRequest = (event: FormEvent<HTMLButtonElement>): void => {
    event.preventDefault();

    setModalOpen(true);
  };

  const create = async (result: InputModalResult): Promise<void> => {
    if (result.value) {
      const value = await factory(result.value);
      if (value) {
        onCreate(value);
      } else {
        onError(result.value);
      }
    }
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
        onReturn={create}
        onClose={onModalClose}
      />
      <div className="input-group mb-3">
        <select id={id} className="form-control" value={value} onChange={onSelectChange}>
          {items.length &&
            items.map((item: Item, i) => (
              <option key={i} value={item.id}>
                {textGetter(item)}
              </option>
            ))}
        </select>
        <div className="input-group-append">
          <button className="input-group-text" onClick={onCreateRequest}>
            <i className="fa fa-plus-circle" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default PropertySelector;
