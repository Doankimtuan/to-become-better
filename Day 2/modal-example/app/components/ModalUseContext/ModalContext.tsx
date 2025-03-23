import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import ModalComponent from "./Modal";

export interface ModalOptions {
  onClose?: () => void;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ModalProps extends ModalOptions {
  isOpen: boolean;
  children: ReactNode;
}

interface ModalContextType {
  openModal: (content: ReactNode, options?: ModalOptions) => string;
  closeModal: (id: string) => void;
  closeAll: () => void;
  alert: (
    message: string,
    options?: Omit<ModalOptions, "onConfirm" | "onCancel">
  ) => void;
  confirm: (message: string, options?: ModalOptions) => Promise<boolean>;
  form: (content: ReactNode, options?: ModalOptions) => Promise<boolean>;
  custom: (content: ReactNode, options?: ModalOptions) => string;
}

interface ModalState {
  id: string;
  content: ReactNode;
  options: ModalOptions;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modals, setModals] = useState<ModalState[]>([]);

  const openModal = useCallback(
    (content: ReactNode, options: ModalOptions = {}) => {
      const id = Math.random().toString(36).substring(2, 9);
      setModals((prevModals) => [...prevModals, { id, content, options }]);
      return id;
    },
    []
  );

  const closeModal = useCallback((id: string) => {
    setModals((prevModals) => prevModals.filter((modal) => modal.id !== id));
  }, []);

  const closeAll = useCallback(() => {
    setModals([]);
  }, []);

  const alert = useCallback(
    (
      message: string,
      options: Omit<ModalOptions, "onConfirm" | "onCancel"> = {}
    ) => {
      const content = (
        <div className="text-center space-y-4">
          <p className="text-gray-700">{message}</p>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => closeModal(id)}
          >
            OK
          </button>
        </div>
      );
      const id = openModal(content, {
        ...options,
        className: `alert-modal ${options.className || ""}`,
      });
    },
    [openModal, closeModal]
  );

  const confirm = useCallback(
    (message: string, options: ModalOptions = {}) => {
      return new Promise<boolean>((resolve) => {
        const content = (
          <div className="text-center space-y-4">
            <p className="text-gray-700">{message}</p>
            <div className="flex justify-center gap-3">
              <button
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={() => {
                  options.onCancel?.();
                  resolve(false);
                  closeModal(id);
                }}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => {
                  options.onConfirm?.();
                  resolve(true);
                  closeModal(id);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        );
        const id = openModal(content, {
          ...options,
          className: `confirm-modal ${options.className || ""}`,
        });
      });
    },
    [openModal, closeModal]
  );

  const form = useCallback(
    (content: ReactNode, options: ModalOptions = {}) => {
      return new Promise<boolean>((resolve) => {
        const wrappedContent = (
          <div className="space-y-6">
            <div className="form-content">{content}</div>
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={() => {
                  options.onCancel?.();
                  resolve(false);
                  closeModal(id);
                }}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => {
                  options.onConfirm?.();
                  resolve(true);
                  closeModal(id);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        );
        const id = openModal(wrappedContent, {
          ...options,
          className: `form-modal ${options.className || ""}`,
        });
      });
    },
    [openModal, closeModal]
  );

  const custom = useCallback(
    (content: ReactNode, options: ModalOptions = {}) => {
      return openModal(content, {
        ...options,
        className: `custom-modal ${options.className || ""}`,
      });
    },
    [openModal]
  );

  const value = {
    openModal,
    closeModal,
    closeAll,
    alert,
    confirm,
    form,
    custom,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modals.map((modal) => (
        <ModalComponent
          key={modal.id}
          isOpen={true}
          onClose={() => {
            modal.options.onClose?.();
            closeModal(modal.id);
          }}
          closeOnEscape={modal.options.closeOnEscape ?? true}
          closeOnOverlayClick={modal.options.closeOnOverlayClick ?? true}
          className={modal.options.className}
        >
          {modal.content}
        </ModalComponent>
      ))}
    </ModalContext.Provider>
  );
};
