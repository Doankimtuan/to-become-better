import { forwardRef, useImperativeHandle, type ReactNode } from "react";
import { ModalProvider, useModal, type ModalOptions } from "./ModalContext";

export { useModal };

export interface ModalHandle {
  show: (content: ReactNode, options?: ModalOptions) => string;
  close: (id: string) => void;
  closeAll: () => void;
}

const ModalComponent = forwardRef<ModalHandle, {}>((props, ref) => {
  const modalContext = useModal();

  useImperativeHandle(
    ref,
    () => ({
      show: (content: ReactNode, options?: ModalOptions) => {
        return modalContext.openModal(content, options);
      },
      close: (id: string) => {
        modalContext.closeModal(id);
      },
      closeAll: () => {
        modalContext.closeAll();
      },
    }),
    [modalContext]
  );

  return null;
});

export const Modal = {
  _ref: null as ModalHandle | null,

  show(content: ReactNode, options?: ModalOptions): string {
    if (!this._ref) {
      throw new Error(
        "Modal is not initialized. Make sure ModalProvider is set up correctly."
      );
    }
    return this._ref.show(content, options);
  },

  close(id: string): void {
    if (!this._ref) {
      throw new Error(
        "Modal is not initialized. Make sure ModalProvider is set up correctly."
      );
    }
    this._ref.close(id);
  },

  closeAll(): void {
    if (!this._ref) {
      throw new Error(
        "Modal is not initialized. Make sure ModalProvider is set up correctly."
      );
    }
    this._ref.closeAll();
  },
};

const EnhancedModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <ModalProvider>
      <ModalComponent
        ref={(ref) => {
          Modal._ref = ref;
        }}
      />
      {children}
    </ModalProvider>
  );
};

export { EnhancedModalProvider as ModalProvider };
