import { createEnvironment } from '../services/environments';
import InputModal, { InputModalResult } from './input-modal';

interface NewEnvironmentModalProps {
  id: string;
  isOpen: boolean;
  onClose: any;
  onNewEnvironment: any;
  onEnvironmentError: any;
}

const NewEnvironmentModal = ({
  id,
  isOpen,
  onClose,
  onNewEnvironment,
  onEnvironmentError,
}: NewEnvironmentModalProps) => {
  const onCreateEnvironment = async (result: InputModalResult): Promise<void> => {
    if (result.value) {
      const environmentDescription = result.value;

      const environment = await createEnvironment(environmentDescription);
      if (environment) {
        onNewEnvironment(environment);
      } else {
        onEnvironmentError(environmentDescription);
      }
    }
  };

  return (
    <InputModal
      id={id}
      title="Nuevo Entorno"
      caption="Descripción"
      buttonCaption="Crear"
      isOpen={isOpen}
      onReturn={onCreateEnvironment}
      onClose={onClose}
      placeholder="Nombre del entorno"
    />
  );
};

export default NewEnvironmentModal;
