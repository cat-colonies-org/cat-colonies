// import { createLocationType } from '../services/location-types';
import { createLocationType } from '../services/location-types';
import InputModal, { InputModalResult } from './input-modal';

interface NewLocationTypeModalProps {
  id: string;
  isOpen: boolean;
  onClose: any;
  onNewLocationType: any;
  onLocationTypeError: any;
}

const NewLocationTypeModal = ({
  id,
  isOpen,
  onClose,
  onNewLocationType,
  onLocationTypeError,
}: NewLocationTypeModalProps) => {
  const onCreateLocationType = async (result: InputModalResult): Promise<void> => {
    if (result.value) {
      const locationTypeDescription = result.value;

      const locationType = await createLocationType(locationTypeDescription);
      if (locationType) {
        onNewLocationType(locationType);
      } else {
        onLocationTypeError(locationTypeDescription);
      }
    }
  };

  return (
    <InputModal
      id={id}
      title="Nueva Ubicación"
      caption="Descripción"
      buttonCaption="Crear"
      onClose={onClose}
      onReturn={onCreateLocationType}
      isOpen={isOpen}
    />
  );
};

export default NewLocationTypeModal;
