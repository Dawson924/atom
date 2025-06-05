export const CircleSpinner = ({ text }: {
    text?: string
}) => {
    return (
        <div className="p-6 transition-all duration-300">
            <div className="flex justify-center items-center h-24">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-blue-500 dark:border-t-blue-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
            </div>
            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                {text}
            </p>
        </div>
    );
};
