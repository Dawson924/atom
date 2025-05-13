export default function ManagePage() {
    return (
        <div className="h-main">
            <div className="flex flex-row">

                <div className="z-10 w-40 h-main flex flex-shrink-0 flex-col shadow-lg border-r border-gray-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"></div>

                <div className="px-4 py-6 w-full h-main flex flex-col overflow-y-auto bg-blue-100 dark:bg-neutral-700 scroll-container"></div>

            </div>
        </div>
    );
}