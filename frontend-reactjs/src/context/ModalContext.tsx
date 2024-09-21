import { createContext, ReactNode, RefObject, useRef } from 'react'

//modal ref
export type TModalContextType = {
  modalRef: RefObject<HTMLDialogElement>
  openModal: () => void
  closeModal: () => void
}

const initialModalContext: TModalContextType = {
  modalRef: { current: null },
  openModal: () => {},
  closeModal: () => {},
}

export const ModalContext =
  createContext<TModalContextType>(initialModalContext)

const ModalContextProvider = ({ children }: { children: ReactNode }) => {
  const modalRef = useRef<HTMLDialogElement>(null)

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal()
    }
  }

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close()
    }
  }

  return (
    <ModalContext.Provider value={{ modalRef, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export default ModalContextProvider
