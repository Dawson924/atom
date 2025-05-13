import { useEffect, useState } from 'react';
import { useNavigate } from '../../router';

export default function HomePage() {
    const navigate = useNavigate();

    const [versionName, setVersionName] = useState<string | undefined>();

    useEffect(() => {
        window.store.get('launcher.launchVersion').then(value => {
            setVersionName(value);
        });
    }, []);

    return (
        <>
            <div className="h-main bg-blue-100 dark:bg-neutral-700">
                <div className="flex flex-row">

                    <div className="z-10 w-[300px] h-main flex flex-shrink-0 flex-col shadow-lg border-r border-gray-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                        <div className="h-full">

                        </div>
                        <div className="p-5 w-full h-40 space-y-4">
                            <div
                                className="w-full h-16 flex flex-col justify-center items-center transition-all cursor-pointer border rounded-lg border-blue-400 hover:bg-blue-100 dark:border-blue-500 dark:hover:bg-blue-500"
                                onClick={async () => {
                                    if (!versionName)
                                        return navigate('home/versions');

                                    window.launcher.launch(versionName, await window.store.get('launcher.javaPath'));
                                }}
                            >
                                <h3 className="text-xl font-semibold font-[Inter] text-gray-900 dark:text-gray-200">Launch</h3>
                                <p className="text-xs font-[Inter] text-gray-400">{versionName ?? 'Choose a minecraft version'}</p>
                            </div>
                            <div className="grid grid-cols-2 space-x-2">
                                <div
                                    className="h-9 flex flex-col justify-center items-center transition-all cursor-pointer border rounded-md border-gray-500 hover:bg-gray-100 dark:border-gray-400 dark:hover:bg-gray-200 group"
                                    onClick={() => navigate('/home/versions')}
                                >
                                    <h4 className="lowercase tracking-wide text-sm font-semibold font-[Inter] text-gray-700 dark:text-gray-200 group-hover:text-gray-950">versions</h4>
                                </div>
                                <div
                                    className="h-9 flex flex-col justify-center items-center transition-all cursor-pointer border rounded-md border-gray-500 hover:bg-gray-100 dark:border-gray-400 dark:hover:bg-gray-200 group"
                                    onClick={() => navigate('/home/manage')}
                                >
                                    <h4 className="lowercase tracking-wide text-sm font-semibold font-[Inter] text-gray-700 dark:text-gray-200 group-hover:text-gray-950">manage</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-6 w-full h-main">

                    </div>

                </div>
            </div>
        </>
    );
}
