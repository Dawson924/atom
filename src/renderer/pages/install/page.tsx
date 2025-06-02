import ClientPage from './client';
import ServerPage from './server';
import ModsPage from './mods';
import { useInstallPage } from '@renderer/hooks/store';
import { TaskFloatingButton } from '@renderer/components/features/task/fab';


export default function InstallerPage() {
    const { currentPage, goTo } = useInstallPage();

    return (
        <div className="relative h-main bg-blue-100 dark:bg-neutral-700">
            <div className="flex flex-row">

                <div className="z-10 w-32 h-main flex flex-shrink-0 flex-col shadow-lg border-r border-gray-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                    <div className="w-full h-full">
                        {/* Minecraft Section */}
                        <div className="px-5 pt-3 mb-1">
                            <h2 className="text-xs font-semibold font-[Inter] tracking-tighter uppercase text-neutral-400">
                                Minecraft
                            </h2>
                        </div>
                        <nav aria-label="Main" className="flex flex-col justify-start items-start">
                            {
                                ['client', 'server'].map(item => {
                                    return (
                                        item === currentPage ?
                                            <SelectedItem key={item} value={item} />
                                            :
                                            <UnselectedItem key={item} value={item} onClick={() => goTo(item)} />
                                    );
                                })
                            }
                        </nav>

                        {/* Community Resource */}
                        <div className="px-5 pt-3 mb-1">
                            <h2 className="text-xs font-semibold font-[Inter] tracking-tighter uppercase text-neutral-400">
                                Community
                            </h2>
                        </div>
                        <nav aria-label="Main" className="flex flex-col justify-start items-start">
                            {
                                ['mods'].map(item => {
                                    return (
                                        item === currentPage ?
                                            <SelectedItem key={item} value={item} />
                                            :
                                            <UnselectedItem key={item} value={item} onClick={() => goTo(item)} />
                                    );
                                })
                            }
                        </nav>
                    </div>
                </div>

                {typeof currentPage === 'string' ? (
                    currentPage === 'client' ? (
                        <ClientPage />
                    ) : currentPage === 'server' ? (
                        <ServerPage />
                    ) : currentPage === 'mods' ? (
                        <ModsPage />
                    ) : null
                ) : currentPage || null}

                <TaskFloatingButton />

            </div>
        </div>
    );
}

const SelectedItem = ({ value }: { value: string }) => (
    <div className="w-full text-sm font-semibold overflow-hidden hover:overflow-auto">
        <div
            className="relative flex justify-start items-center px-5 py-2 w-full cursor-pointer text-blue-600 dark:text-blue-400 hover:bg-blue-50 hover:dark:bg-neutral-700"
        >
            <div className="absolute left-0.5 top-1/4 h-1/2 rounded-sm border-l-3 border-blue-600 dark:border-blue-400"></div>
            <h4 className="text-xs font-bold font-[Inter] uppercase">
                {value}
            </h4>
        </div>
    </div>
);

const UnselectedItem = ({ value, onClick }: { value: string, onClick: () => void }) => (
    <div className="w-full text-sm font-semibold overflow-hidden hover:overflow-auto" onClick={onClick}>
        <div
            className="relative flex justify-start items-center px-5 py-2 w-full cursor-pointer text-gray-500 hover:bg-blue-50 dark:hover:bg-neutral-700"
        >
            <h4 className="text-xs font-bold font-[Inter] uppercase">
                {value}
            </h4>
        </div>
    </div>
);
