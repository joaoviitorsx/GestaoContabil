import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ModalProps } from "../types/components/modal";

function Modal({ isOpen, onClose, icon, title, children, footer, width = "max-w-lg" }: ModalProps) {
    return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`relative bg-white rounded-2xl shadow-xl p-6 w-full ${width} z-10`}>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                {icon && <span>{icon}</span>}
                <h2 className="text-lg font-semibold text-gray-800">
                  {title || "Janela"}
                </h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto">
              {children}
            </div>

            {footer && (
              <div className="mt-6 flex justify-end gap-2 pt-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Modal;