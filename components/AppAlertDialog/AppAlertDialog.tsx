import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  UseDisclosureReturn,
} from '@chakra-ui/react'
import { FC, useRef } from 'react'

interface AppAlertDialogProps {
  customOnClose: () => void
  disclosure: UseDisclosureReturn
  isLoading: boolean
  handleSubmit: () => void
  header?: string
  body?: string
}

const AppAlertDialog: FC<AppAlertDialogProps> = ({
  customOnClose,
  disclosure,
  isLoading,
  handleSubmit,
  header,
  body,
}) => {
  const { isOpen } = disclosure
  const cancelRef = useRef()

   // ALERT FOR ALLERTING THINGS 
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef.current}
      onClose={customOnClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />
       
      <AlertDialogContent>
        <AlertDialogHeader>{header}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>{body}</AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef.current} onClick={customOnClose}>
            Close
          </Button>
          <Button colorScheme="blue" ml={3} onClick={handleSubmit} isLoading={isLoading} isDisabled={isLoading}>
            Submit
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AppAlertDialog
