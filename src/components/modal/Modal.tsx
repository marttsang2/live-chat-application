type ModalProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    children: React.ReactNode;
};

function Modal({ isOpen, setIsOpen, children }: ModalProps) {

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed z-30 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
            <div className="bg-white rounded-lg p-8 z-40">
                <div className="flex justify-end">
                    <button onClick={toggleModal}>
                    <svg className="w-5 h-6" version="1.1"
                        xmlns="http://www.w3.org/2000/svg">
                        <line x1="1" y1="11" 
                              x2="11" y2="1" 
                              stroke="black" 
                              stroke-width="2"/>
                        <line x1="1" y1="1" 
                              x2="11" y2="11" 
                              stroke="black" 
                              stroke-width="2"/>
                    </svg>
                    </button>
                </div>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;