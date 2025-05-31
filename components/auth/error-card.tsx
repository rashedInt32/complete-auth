import { FaExclamation, FaExclamationTriangle } from 'react-icons/fa'
import { CardWrapper } from './card-wrapper'

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Opps! something went wrong"
      backButtonLabel="Back to login"
      backButtonHref="/auht/login"
    >
      <div className="flex items-center justify-center">
        <FaExclamationTriangle className="w-6 h-6 text-red-600" />
      </div>
    </CardWrapper>
  )
}
