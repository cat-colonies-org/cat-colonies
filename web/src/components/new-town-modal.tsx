import { FormEvent, useRef, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

interface NewModalProps {
  id: string;
  isOpen: boolean;
  onRequestClose: any;
}

const NewTownModal = ({ id, isOpen, onRequestClose }: NewModalProps) => {
  const [state, setState] = useState({ name: '' });
  const nameInput = useRef(null);

  const onAfterOpen = () => {
    setState({ name: '' });
    nameInput?.current?.focus();
  };

  const onSubmit = (event: FormEvent): void => {
    event.preventDefault();
  };

  const onInputChange = (event: FormEvent<HTMLInputElement>): void => {
    setState({ ...state, [event.currentTarget.id]: event.currentTarget.value });
  };

  const onCreateTownClick = (event: FormEvent<HTMLButtonElement>): void => {
    event.preventDefault();

    // TODO: crear ciudad
    // TODO: devolver nuevo código

    toast.success(`Ciudad ${state.name} creada 👍`);

    onRequestClose();
  };

  return (
    <Modal
      id={id}
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      ariaHideApp={false}
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
      <form onSubmit={onSubmit}>
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
              value={state.name}
              onChange={onInputChange}
              placeholder="Nombre de la localidad"
              ref={nameInput}
            />
            <button className="btn btn-primary mt-3" onClick={onCreateTownClick}>
              Crear
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default NewTownModal;
