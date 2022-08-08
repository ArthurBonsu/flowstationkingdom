import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  UseDisclosureReturn,
} from '@chakra-ui/react'

interface AppModalProps {
  disclosure: UseDisclosureReturn
  title?: string
  closeOnOverlayClick?: boolean
  modalSize?: ModalProps['size']
}

/// THE APP MODAL
const AppModal: React.FC<AppModalProps> = ({ disclosure, title, modalSize = '4xl', children, ...rest }) => (
  <Modal onClose={disclosure.onClose} isOpen={disclosure.isOpen} size={modalSize} closeOnOverlayClick={true} {...rest}>
    <ModalOverlay />
    <ModalContent>
      {title && <ModalHeader>{title}</ModalHeader>}
      <ModalCloseButton />
      <ModalBody>{children}</ModalBody>
    </ModalContent>
  </Modal>
)

export default AppModal
