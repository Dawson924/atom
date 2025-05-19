import {
    cloneElement,
    ComponentType,
    createContext,
    createElement,
    isValidElement,
    ReactElement,
    ReactNode,
    useContext,
    useState,
} from 'react';

type ModalComponentProps = { open: boolean; onClose: () => void };
type ModalElement = ReactElement<ModalComponentProps>;
type ModalType = ComponentType<ModalComponentProps> | ModalElement;
type ModalContext = {
    openModal: (modal: ModalType | any, params?: { [key: string]: any }) => void;
    closeModal: () => void;
};

const ModalContext = createContext<ModalContext>({
    openModal: () => undefined,
    closeModal: () => undefined,
});

export const useModal = () => useContext(ModalContext);

const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalElement, setModalElement] = useState<ModalElement | null>(null);

    const openModal = (modal: ModalType, params?: { [key: string]: any }) => {
        let element: ModalElement;

        if (isValidElement(modal)) {
            // 如果是已经创建的元素，克隆并添加props
            element = cloneElement(modal, {
                open: true,
                onClose: closeModal,
                ...params,
            });
        } else {
            // 如果是组件类，创建元素并传递props
            const Component = modal as ComponentType<ModalComponentProps>;
            element = createElement(Component, {
                open: true,
                onClose: closeModal,
                ...params,
            });
        }

        setModalElement(element);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setModalElement(null);
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            {modalElement &&
                cloneElement(modalElement, {
                    open: isOpen,
                    onClose: closeModal,
                })}
        </ModalContext.Provider>
    );
};

export { ModalProvider };
