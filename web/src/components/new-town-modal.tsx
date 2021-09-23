import { createTown } from '../services/towns';
import InputModal, { InputModalResult } from './input-modal';

interface NewTownModalProps {
  id: string;
  isOpen: boolean;
  onClose: any;
  onNewTown: any;
  onTownError: any;
}

const NewTownModal = ({ id, isOpen, onClose, onNewTown, onTownError }: NewTownModalProps) => {
  const onCreateTown = async (result: InputModalResult): Promise<void> => {
    if (result.value) {
      const townName = result.value;

      const town = await createTown(townName);
      if (town) {
        onNewTown(town);
      } else {
        onTownError(townName);
      }
    }
  };

  return (
    <InputModal
      id={id}
      title="Nueva Localidad"
      caption="Nombre"
      buttonCaption="Crear"
      isOpen={isOpen}
      onReturn={onCreateTown}
      onClose={onClose}
    />
  );
};

export default NewTownModal;
