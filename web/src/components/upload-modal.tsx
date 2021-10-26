import Modal from 'react-modal';

interface UploadModalProps {
  id: string;
  isOpen: boolean;
  onClose: any;
  onReturn: any;
}

const UploadModal = ({ id, isOpen, onClose, onReturn }: UploadModalProps) => {
  return (
    <Modal
      id={id}
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      ariaHideApp={false}
      shouldFocusAfterRender={true}
      shouldReturnFocusAfterClose={true}
      closeTimeoutMS={400}
      style={{
        overlay: {
          backgroundColor: 'rgba(0,0,0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          width: '80pc',
          position: 'relative',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '20px',
          padding: '40px',
        },
      }}
    >
      <>
        <form onSubmit={onReturn}>
          <div className="row">
            <div className="col">
              <h4>Subir imágenes</h4>
              <hr />
              <input type="file" name="pictures" className="form-control" />
              <br />
              <input type="file" name="pictures" className="form-control" />
              <br />
              <input type="file" name="pictures" className="form-control" />
              <br />
              <input type="file" name="pictures" className="form-control" />
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col" style={{ textAlign: 'right' }}>
              <button type="submit" className="btn btn-primary mr-2">
                Añadir
              </button>
              <button className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </form>
      </>
    </Modal>
  );
};

export default UploadModal;
