import { createTown } from '../services/towns';
import InputModal, { InputModalResult } from './input-modal';

interface NewTownModalProps {
  id: string;
  isOpen: boolean;
  onRequestClose: any;
  onNewTownSuccess: any;
  onNewTownError: any;
}

const NewTownModal = ({ id, isOpen, onRequestClose, onNewTownSuccess, onNewTownError }: NewTownModalProps) => {
  const onCreateTown = async (result: InputModalResult): Promise<void> => {
    if (result.value) {
      const townName = result.value;

      const town = await createTown(townName);
      if (town) {
        onNewTownSuccess(town);
      } else {
        onNewTownError(townName);
      }
    }
  };

  return (
    <InputModal
      id={id}
      title="Nueva Localidad"
      caption="Nombre"
      buttonCaption="Crear"
      onClose={onRequestClose}
      onReturn={onCreateTown}
      isOpen={isOpen}
    />
  );
};

export default NewTownModal;
