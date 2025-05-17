const Container: React.FC<Tentative> = ({ children }) => {
    return (
        <div className="px-4 py-6 w-full h-main relative flex flex-col overflow-y-scroll scroll-container">
            {children}
        </div>
    );
};

export { Container };
