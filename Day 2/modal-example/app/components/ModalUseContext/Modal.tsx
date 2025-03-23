import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import type { ModalProps } from "./ModalContext";

const ModalComponent: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  className,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, closeOnEscape]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`
          bg-white rounded-xl shadow-xl 
          p-6 max-w-md w-full mx-auto 
          max-h-[90vh] overflow-y-auto 
          transform transition-all duration-200 ease-out
          scale-100 opacity-100
          ${className || ""}
        `}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default ModalComponent;
