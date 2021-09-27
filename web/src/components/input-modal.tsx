import { FormEvent, useRef, useState } from 'react';
import Modal from 'react-modal';

interface InputModalProps {
  id: string;
  title: string;
  caption: string;
  buttonCaption: string;
  isOpen: boolean;
  onClose: any;
  onReturn: any;
}

export interface InputModalResult {
  value: string;
}

const InputModal = ({ id, title, caption, buttonCaption = 'Aceptar', isOpen, onClose, onReturn }: InputModalProps) => {
  const [state, setState] = useState({ value: '' } as InputModalResult);
  const input = useRef<HTMLInputElement>(null);

  const onAfterOpen = () => {
    setState({ value: '' });
    input?.current?.focus();
  };

  const onSubmit = (event: FormEvent): void => {
    event.preventDefault();
  };

  const onValueChange = (event: FormEvent<HTMLInputElement>): void => {
    setState({ ...state, [event.currentTarget.id]: event.currentTarget.value });
  };

  const onValueAccepted = (event: FormEvent<HTMLButtonElement>): void => {
    event.preventDefault();

    onReturn(state);

    onClose?.call();
  };

  return (
    <Modal
      id={id}
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onRequestClose={onClose}
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
            <h5>{title}</h5>
            <hr />
            <label htmlFor="id" className="form-label">
              {caption}
            </label>
            <input
              id="value"
              type="text"
              className="form-control"
              value={state.value}
              onChange={onValueChange}
              placeholder="Nombre de la localidad"
              ref={input}
            />
            <button className="btn btn-primary mt-3" onClick={onValueAccepted}>
              {buttonCaption}
            </button>
            <button className="btn btn-danger mt-3" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default InputModal;
