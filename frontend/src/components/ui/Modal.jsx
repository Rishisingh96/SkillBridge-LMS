import React from "react";

import { motion, AnimatePresence } from "framer-motion";

import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title = "Modal Title",
  children,
  width = "max-w-2xl",
  showClose = true,
  footer,
}) => {

  return (

    <AnimatePresence>

      {isOpen && (

        <>
          {/* ===================================== */}
          {/* OVERLAY */}
          {/* ===================================== */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="
              fixed inset-0
              bg-black/50
              backdrop-blur-sm
              z-50
            "
          />

          {/* ===================================== */}
          {/* MODAL */}
          {/* ===================================== */}

          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto">

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.3 }}
              className={`
                w-full
                ${width}
                bg-white
                rounded-3xl
                shadow-2xl
                overflow-hidden
              `}
            >

              {/* ================================= */}
              {/* HEADER */}
              {/* ================================= */}

              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

                <h2 className="text-2xl font-bold text-gray-800">
                  {title}
                </h2>

                {showClose && (

                  <button
                    onClick={onClose}
                    className="
                      w-10 h-10
                      rounded-full
                      hover:bg-gray-100
                      flex items-center justify-center
                      transition-all duration-300
                    "
                  >

                    <X size={22} />

                  </button>

                )}

              </div>

              {/* ================================= */}
              {/* BODY */}
              {/* ================================= */}

              <div className="p-6 max-h-[70vh] overflow-y-auto">

                {children}

              </div>

              {/* ================================= */}
              {/* FOOTER */}
              {/* ================================= */}

              {footer && (

                <div className="px-6 py-5 border-t border-gray-100 bg-gray-50">

                  {footer}

                </div>

              )}

            </motion.div>

          </div>
        </>

      )}

    </AnimatePresence>
  );
};

export default Modal;