import { ModrinthSearch } from '../../components/features/modrinth';
import { useInstallPage } from '@renderer/hooks/store';
import { TaskFloatingButton } from '@renderer/components/features/task';
import { ClientVersionList } from '@renderer/components/features/client';
import { ServerVersionList } from '@renderer/components/features/server';
import { MenuItem } from '@renderer/components/commons/menu';
import { useTranslation } from 'react-i18next';

export default function InstallerPage() {
    const { currentPage, goTo } = useInstallPage();
    const { t } = useTranslation();

    return (
        <div className="relative h-main bg-blue-100 dark:bg-neutral-700">
            <div className="flex flex-row">

                <div className="z-10 w-32 h-main flex flex-shrink-0 flex-col shadow-lg border-r border-gray-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                    <div className="w-full h-full">
                        {/* Minecraft Section */}
                        <div className="px-3 pt-3">
                            <h2 className="text-xs tracking-tighter uppercase text-neutral-400">
                                Minecraft
                            </h2>
                        </div>
                        <nav aria-label="Main" className="flex flex-col justify-start items-start">
                            <MenuItem
                                className="px-5"
                                selected={currentPage === 'client'}
                                label={t('label.client_side')}
                                onSelect={() => goTo('client')}
                            />
                            <MenuItem
                                className="px-5"
                                selected={currentPage === 'server'}
                                label={t('label.server_side')}
                                onSelect={() => goTo('server')}
                            />
                        </nav>

                        {/* Community Resource */}
                        <div className="px-3 pt-3">
                            <h2 className="text-xs tracking-tighter uppercase text-neutral-400">
                                Community
                            </h2>
                        </div>
                        <nav aria-label="Main" className="flex flex-col justify-start items-start">
                            <MenuItem
                                className="space-x-0.5!"
                                selected={currentPage === 'modrinth'}
                                label="Modrinth"
                                icon={(
                                    <svg
                                        className="size-4 text-green-600"
                                        viewBox="0 0 514 514"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M503.16 323.56C514.55 281.47 515.32 235.91 503.2 190.76C466.57 54.2299 326.04 -26.8001 189.33 9.77991C83.8101 38.0199 11.3899 128.07 0.689941 230.47H43.99C54.29 147.33 113.74 74.7298 199.75 51.7098C306.05 23.2598 415.13 80.6699 453.17 181.38L411.03 192.65C391.64 145.8 352.57 111.45 306.3 96.8198L298.56 140.66C335.09 154.13 364.72 184.5 375.56 224.91C391.36 283.8 361.94 344.14 308.56 369.17L320.09 412.16C390.25 383.21 432.4 310.3 422.43 235.14L464.41 223.91C468.91 252.62 467.35 281.16 460.55 308.07L503.16 323.56Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M321.99 504.22C185.27 540.8 44.7501 459.77 8.11011 323.24C3.84011 307.31 1.17 291.33 0 275.46H43.27C44.36 287.37 46.4699 299.35 49.6799 311.29C53.0399 323.8 57.45 335.75 62.79 347.07L101.38 323.92C98.1299 316.42 95.39 308.6 93.21 300.47C69.17 210.87 122.41 118.77 212.13 94.7601C229.13 90.2101 246.23 88.4401 262.93 89.1501L255.19 133C244.73 133.05 234.11 134.42 223.53 137.25C157.31 154.98 118.01 222.95 135.75 289.09C136.85 293.16 138.13 297.13 139.59 300.99L188.94 271.38L174.07 231.95L220.67 184.08L279.57 171.39L296.62 192.38L269.47 219.88L245.79 227.33L228.87 244.72L237.16 267.79C237.16 267.79 253.95 285.63 253.98 285.64L277.7 279.33L294.58 260.79L331.44 249.12L342.42 273.82L304.39 320.45L240.66 340.63L212.08 308.81L162.26 338.7C187.8 367.78 226.2 383.93 266.01 380.56L277.54 423.55C218.13 431.41 160.1 406.82 124.05 361.64L85.6399 384.68C136.25 451.17 223.84 484.11 309.61 461.16C371.35 444.64 419.4 402.56 445.42 349.38L488.06 364.88C457.17 431.16 398.22 483.82 321.99 504.22Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                )}
                                onSelect={() => goTo('modrinth')}
                            />
                        </nav>
                    </div>
                </div>

                {typeof currentPage === 'string' ? (
                    currentPage === 'client' ? (
                        <ClientVersionList />
                    ) : currentPage === 'server' ? (
                        <ServerVersionList />
                    ) : currentPage === 'modrinth' ? (
                        <ModrinthSearch />
                    ) : null
                ) : currentPage || null}

                <TaskFloatingButton />

            </div>
        </div>
    );
}
