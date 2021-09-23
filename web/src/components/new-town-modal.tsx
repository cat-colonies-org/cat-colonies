import { FormEvent, useState } from 'react';
import Modal from 'react-modal';

interface NewModalProps {
  id: string;
  isOpen: boolean;
  onRequestClose: any;
}

const NewTownModal = ({ id, isOpen, onRequestClose }: NewModalProps) => {
  const [name, setName] = useState('');

  const onNameChange = (event: FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const onKeyUp = (event: any) => {
    if (event.key === 'Enter') {
      console.log(event);
    }
  };

  return (
    <Modal
      id={id}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      ariaHideApp={true}
      shouldFocusAfterRender={true}
      shouldReturnFocusAfterClose={true}
      style={{
        overlay: {
          backgroundColor: 'rgba(0,0,0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          position: 'relative',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '4px',
          padding: '40px',
        },
      }}
    >
      <form>
        <div className="row">
          <div className="col">
            <h5>Nueva localidad</h5>
            <hr />
            <label htmlFor="id" className="form-label">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              className="form-control"
              value={name}
              onChange={onNameChange}
              placeholder="Nombre de la localidad"
              onKeyUp={onKeyUp}
            />
            <button className="btn btn-primary mt-3">Crear</button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default NewTownModal;
