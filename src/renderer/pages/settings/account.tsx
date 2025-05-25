import { Button, NativeSelect, TextField } from '@mui/material';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import * as skinview3d from 'skinview3d';
import type { AccountProfile, AccountSession } from '@common/types/auth';
import { Card, Container, Form, FormInput, FormSelect } from '@renderer/components/commons';
import { getSkinData } from '../../utils/auth/skin';
import { InputModal, SelectPromptModal, useModal } from '@renderer/hoc/modal';
import { useToast } from '@renderer/hoc/toast';
import { ConfigService, UserService } from '@renderer/api';

const ANIM_SETS = [
    skinview3d.IdleAnimation,
    skinview3d.WalkingAnimation,
    skinview3d.RunningAnimation,
    skinview3d.CrouchAnimation,
    skinview3d.FlyingAnimation,
    skinview3d.HitAnimation,
    skinview3d.WaveAnimation,
];

export default function AccountPage() {
    const { openModal } = useModal();
    const { addToast } = useToast();
    // Authenticate
    const [session, setSession] = useState<AccountSession>();
    const [skinUrl, setSkinUrl] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    // Account
    const [authOptions, setAuthOptions] = useState<Tentative>();
    const [offlineProfiles, setOfflineProfiles] = useState<AccountProfile[]>();
    const [selectedProfile, setSelectedProfile] = useState<string>();
    // Skin Viewer 3D
    const [animationSelect, setAnimationSelect] = useState<number>(0);
    const [animationSpeed, setAnimationSpeed] = useState<number>(1);
    const [autoRotate, setAutoRotate] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetch = async () => {
        await UserService.session().then(setSession);
        await window.cache.get('account').then(account => {
            if (!account) return;
            setUsername(account.username);
            setPassword(account.password);
        });
        ConfigService.get('authentication').then(setAuthOptions);
        UserService.getProfiles().then(setOfflineProfiles);
        UserService.getSelectedProfile().then(setSelectedProfile);
    };

    useEffect(() => {
        fetch();
    }, []);

    useEffect(() => {
        let isMounted = true;
        if (session?.signedIn) {
            getSkinData(session.profile.id)
                .then(skinData => {
                    if (!isMounted) return;
                    setSkinUrl(skinData.url);
                }).catch((error) => {
                    console.error('Auth lookup failed:', error);
                    if (isMounted) setSkinUrl('');
                });
        }
        return () => { isMounted = false; };
    }, [session]);

    useEffect(() => {
        if (!session || !session.signedIn) return;

        if (!skinUrl) return; // 等待皮肤加载完成

        const canvas = document.getElementById('skin-container');
        if (!(canvas instanceof HTMLCanvasElement)) return;

        let viewer: skinview3d.SkinViewer | null = null;

        try {
            viewer = new skinview3d.SkinViewer({
                canvas,
                width: 200,
                height: 260,
                skin: skinUrl,
                enableControls: false
            });
            // Change camera FOV
            viewer.fov = 50;
            // Zoom out
            viewer.zoom = 0.92;
            viewer.animation = new ANIM_SETS[animationSelect];
            viewer.animation.speed = animationSpeed;
            viewer.autoRotate = autoRotate;
            viewer.autoRotateSpeed = 0.75;
        }
        catch (error) {
            console.error('Viewer initialization failed:', error);
        }

        return () => {
            viewer?.dispose();
        };
    }, [skinUrl, session, animationSelect, animationSpeed, autoRotate, authOptions]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        fetch();
        ConfigService.set(e.target.name, e.target.value);
    };

    const handleLogin = async () => {
        window.cache.set('account', { username, password });
        UserService.login({ username, password })
            .then(() => {
                UserService.session().then(setSession);
                addToast('Signed in successfully');
            }).catch(err => {
                addToast(err.message, 'error');
            });
    };

    const handleLogout = async () => {
        await UserService.invalidate();
        UserService.session().then(setSession);
        addToast('Signed out successfully');
    };

    if (!session || !authOptions) return null;

    return (
        <Container>
            {authOptions.mode === 'yggdrasil' && <Card
                title={session.signedIn ? `Hello, ${session.profile.name}` : 'Sign In'}
                className="mb-6"
            >
                {/* Sign-in Form */}
                <div style={{ display: session.signedIn ? 'none' : 'flex' }} className="flex-col px-5">
                    <div className="px-2 mb-2 w-full h-9.5 flex flex-row space-x-3 items-center rounded-lg">
                        <div>
                            <h4 className="text-sm text-gray-900 dark:text-gray-50">Username</h4>
                        </div>
                        <div className="ml-auto w-full max-w-lg min-w-[200px]">
                            <input
                                name="username"
                                className="w-full h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow"
                                defaultValue={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="px-2 mb-2 w-full h-9.5 flex flex-row space-x-3 items-center rounded-lg">
                        <div>
                            <h4 className="text-sm text-gray-900 dark:text-gray-50">Password</h4>
                        </div>
                        <div className="ml-auto w-full max-w-lg min-w-[200px]">
                            <input
                                name="password"
                                className="w-full h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow"
                                defaultValue={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ display: session.signedIn ? 'block' : 'none' }} className="px-7 mt-3">
                    <div className="px-2 w-full h-6 flex flex-row space-x-3 items-center rounded-lg">
                        <div className="w-16">
                            <h4 className="text-sm text-gray-900 dark:text-gray-50">UID: </h4>
                        </div>
                        <div className="w-full max-w-lg min-w-[200px]">
                            <p className="text-sm text-gray-500 dark:text-gray-300">{session.profile?.id}</p>
                        </div>
                    </div>
                    <div className="px-2 w-full h-6 flex flex-row space-x-3 items-center rounded-lg">
                        <div className="w-16">
                            <h4 className="text-sm text-gray-900 dark:text-gray-50">Name: </h4>
                        </div>
                        <div className="w-full max-w-lg min-w-[200px]">
                            <p className="text-sm text-gray-500 dark:text-gray-300">{session.profile?.name}</p>
                        </div>
                    </div>
                </div>
                <hr style={{ display: session.signedIn ? 'block' : 'none' }} className="h-px my-3 bg-neutral-200 border-0 dark:bg-neutral-700"></hr>
                <div
                    style={{ display: session.signedIn ? 'flex' : 'none' }}
                    className="mb-3 w-full flex-row justify-between items-end"
                >
                    {/* Left Area */}
                    <div className="w-full max-w-3xl">
                        {/* Viewer Panel */}
                        <div className="px-7 mt-3 space-y-5 flex flex-col">
                            {/* Animation select */}
                            <div className="px-2 h-6 flex flex-row space-x-4 items-center rounded-lg">
                                <div>
                                    <h4 className="w-24 text-sm text-nowrap text-gray-900 dark:text-gray-50">Animation</h4>
                                </div>
                                <div className="w-full">
                                    <NativeSelect
                                        className="h-6 w-full"
                                        defaultValue={animationSelect}
                                        onChange={(e) => setAnimationSelect(parseInt(e.target.value))}
                                    >
                                        <option value={0}>Idle</option>
                                        <option value={1}>Walking</option>
                                        <option value={2}>Running</option>
                                        <option value={3}>Crouch</option>
                                        <option value={4}>Flying</option>
                                        <option value={5}>Hit</option>
                                        <option value={6}>Wave</option>
                                    </NativeSelect>
                                </div>
                            </div>
                            {/* Animation speed */}
                            <div className="px-2 h-6 flex flex-row space-x-4 items-center rounded-lg">
                                <div>
                                    <h4 className="w-24 text-sm text-nowrap text-gray-900 dark:text-gray-50">Speed</h4>
                                </div>
                                <div className="w-full">
                                    <TextField
                                        id="outlined-size-small"
                                        className="w-full"
                                        size="small"
                                        defaultValue={animationSpeed}
                                        onChange={(e) => setAnimationSpeed(pre => parseInt(e.target.value) || pre)}
                                    />
                                </div>
                            </div>
                            {/* Auto rotation */}
                            <div className="px-2 h-6 flex flex-row space-x-4 items-center rounded-lg">
                                <div>
                                    <h4 className="w-24 text-sm text-nowrap text-gray-900 dark:text-gray-50">Auto Rotation</h4>
                                </div>
                                <div className="w-full">
                                    <div
                                        className={`relative rounded-full w-12 h-6 transition duration-200 ease-linear ${autoRotate ? 'bg-blue-600 dark:bg-blue-500' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                                    >
                                        <label
                                            htmlFor="autoRotate"
                                            className={`absolute left-0 bg-white dark:bg-neutral-800 border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer ${autoRotate ? 'translate-x-full border-blue-500' : 'translate-x-0 border-neutral-300 dark:border-neutral-700'}`}
                                        />
                                        <input
                                            type="checkbox"
                                            id="autoRotate"
                                            name="autoRotate"
                                            className="appearance-none w-full h-full cursor-pointer active:outline-none focus:outline-none"
                                            onClick={() => setAutoRotate(pre => !pre)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Skin Upload */}
                        <div className="px-6 mt-6 flex items-center justify-center">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer transition-colors bg-gray-50 dark:bg-neutral-800 dark:hover:bg-neutral-700 hover:bg-gray-100 dark:border-neutral-600 dark:hover:border-gray-500"
                            >
                                <div className="flex flex-col items-center justify-center pt-1 pb-2">
                                    <svg
                                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PNG (64x64px, 64x32px, MAX. 128x128px)
                                    </p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const files = e.target.files;

                                        // Check if exactly one file is selected
                                        if (!files || files.length !== 1) {
                                            throw new Error('Please select exactly one file');
                                        }

                                        const file = files[0];

                                        // Verify the file type is PNG
                                        if (file.type !== 'image/png') {
                                            throw new Error('Please select a PNG file');
                                        }

                                        try {
                                            // Convert the file to ArrayBuffer
                                            const arrayBuffer = await file.arrayBuffer();
                                            const skinData: Uint8Array = new Uint8Array(arrayBuffer);
                                            const callback = async (model: 'slim' | 'steve') => {
                                                try {
                                                    // 1. 确保先完成皮肤上传
                                                    await UserService.setTexture({
                                                        accessToken: session.account.accessToken,
                                                        uuid: session.profile.id,
                                                        type: 'skin',
                                                        texture: {
                                                            data: skinData,
                                                            metadata: {
                                                                model: model
                                                            }
                                                        }
                                                    });

                                                    // 2. 获取最新 session 数据（带重试机制）
                                                    const fetchWithRetry = async (attempt = 0): Promise<string | undefined> => {
                                                        const newSession = await UserService.session();
                                                        const newSkinData = await getSkinData(newSession.profile.id);

                                                        // 验证皮肤是否更新成功
                                                        if (newSkinData.url !== skinUrl) {
                                                            return newSkinData.url;
                                                        }
                                                        else if (attempt > 10) {
                                                            return;
                                                        }
                                                        await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
                                                        return fetchWithRetry(attempt + 1);
                                                    };

                                                    // 3. 更新 session 和皮肤状态
                                                    const verifiedSkinUrl = await fetchWithRetry();
                                                    if (!verifiedSkinUrl)
                                                        throw new Error('Cannot verify the skin url');
                                                    else
                                                        setSkinUrl(verifiedSkinUrl);

                                                } catch (error) {
                                                    addToast(error.message, 'error');
                                                }
                                            };
                                            openModal(SelectPromptModal, {
                                                title: 'Choose Skin Model',
                                                message: 'You can choose between two distinct arm models for their character: the classic Steve model and the Slim model.',
                                                items: [
                                                    {
                                                        label: 'Steve',
                                                        icon: (<svg
                                                            className="size-5"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                                            <g id="SVGRepo_iconCarrier">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    clipRule="evenodd"
                                                                    d="M15 3C15 2.44772 15.4477 2 16 2H20C21.1046 2 22 2.89543 22 4V8C22 8.55229 21.5523 9 21 9C20.4477 9 20 8.55228 20 8V5.41288L15.4671 9.94579C15.4171 9.99582 15.363 10.0394 15.3061 10.0767C16.3674 11.4342 17 13.1432 17 15C17 19.4183 13.4183 23 9 23C4.58172 23 1 19.4183 1 15C1 10.5817 4.58172 7 9 7C10.8559 7 12.5642 7.63197 13.9214 8.69246C13.9587 8.63539 14.0024 8.58128 14.0525 8.53118L18.5836 4H16C15.4477 4 15 3.55228 15 3ZM9 20.9963C5.68831 20.9963 3.00365 18.3117 3.00365 15C3.00365 11.6883 5.68831 9.00365 9 9.00365C12.3117 9.00365 14.9963 11.6883 14.9963 15C14.9963 18.3117 12.3117 20.9963 9 20.9963Z"
                                                                    fill="#0F0F0F"
                                                                />
                                                            </g>
                                                        </svg>),
                                                        onSelect: () => callback('steve'),
                                                    },
                                                    {
                                                        label: 'Slim',
                                                        icon: (<svg
                                                            className="size-5"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                                            <g id="SVGRepo_iconCarrier">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    clipRule="evenodd"
                                                                    d="M20 9C20 13.0803 16.9453 16.4471 12.9981 16.9383C12.9994 16.9587 13 16.9793 13 17V19H14C14.5523 19 15 19.4477 15 20C15 20.5523 14.5523 21 14 21H13V22C13 22.5523 12.5523 23 12 23C11.4477 23 11 22.5523 11 22V21H10C9.44772 21 9 20.5523 9 20C9 19.4477 9.44772 19 10 19H11V17C11 16.9793 11.0006 16.9587 11.0019 16.9383C7.05466 16.4471 4 13.0803 4 9C4 4.58172 7.58172 1 12 1C16.4183 1 20 4.58172 20 9ZM6.00365 9C6.00365 12.3117 8.68831 14.9963 12 14.9963C15.3117 14.9963 17.9963 12.3117 17.9963 9C17.9963 5.68831 15.3117 3.00365 12 3.00365C8.68831 3.00365 6.00365 5.68831 6.00365 9Z"
                                                                    fill="#0F0F0F"
                                                                />
                                                            </g>
                                                        </svg>
                                                        ),
                                                        onSelect: () => callback('slim'),
                                                    }
                                                ],
                                            });
                                        } catch (error) {
                                            console.error('Error converting file to ArrayBuffer:', error);
                                            throw new Error('Error processing file');
                                        } finally {
                                            if (fileInputRef.current)
                                                fileInputRef.current.value = '';
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                    {/* Skin Viewer 3D */}
                    <canvas id="skin-container" className="z-10"></canvas>
                    {/* Sign-out */}
                    <Button
                        className="mr-4 min-w-24 text-nowrap"
                        variant="outlined"
                        color="error"
                        onClick={handleLogout}
                    >
                        Sign out
                    </Button>
                </div>
                {/* Button Action Panel */}
                {
                    !session.signedIn &&
                    <div className="px-7 my-2 space-x-4 inline-flex justify-start items-center">

                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                    </div>
                }
            </Card>}
            {authOptions.mode === 'yggdrasil' &&
                <Card
                    title="Yggdrasil Agent"
                    className="mb-6"
                >
                    <Form>
                        <FormInput
                            title="Server"
                            name="authentication.yggdrasilAgent.server"
                            value={authOptions.yggdrasilAgent.server}
                            onChange={handleChange}
                        />
                        <FormInput
                            title="Agent"
                            name="authentication.yggdrasilAgent.jar"
                            value={authOptions.yggdrasilAgent.jar}
                            onChange={handleChange}
                        />
                    </Form>
                </Card>}
            <Card
                title="Account"
            >
                <Form>
                    <FormSelect
                        title="Mode"
                        name="authentication.mode"
                        value={authOptions.mode}
                        onChange={handleChange}
                        options={[
                            { label: 'Offline', value: 'offline' },
                            { label: 'Yggdrasil', value: 'yggdrasil' },
                        ]}
                    />
                    {authOptions.mode === 'offline' && offlineProfiles &&
                        <>
                            <FormSelect
                                title="Profiles"
                                value={offlineProfiles.find(i => i.id === selectedProfile)?.name}
                                onChange={(e) =>
                                    UserService
                                        .setSelectedProfile(
                                            offlineProfiles.find(i => i.name === e.target.value).id
                                        )
                                }
                                options={offlineProfiles.map(item => {
                                    return { label: item.name, value: item.name };
                                })}
                            />
                            <div className="px-2 my-2 w-full flex justify-end">
                                <Button
                                    type="button"
                                    className="w-fit"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        openModal(InputModal, {
                                            title: 'New Profile',
                                            name: 'Username',
                                            onConfirm: (value: string) => {
                                                if (!value) return;
                                                UserService.addProfile(value)
                                                    .then(() => {
                                                        fetch();
                                                        addToast(`New profile - ${value}`);
                                                    })
                                                    .catch(() => {
                                                        addToast('Profile already exists', 'error');
                                                    });
                                            }
                                        });
                                    }}
                                >
                                    New Profile
                                </Button>
                            </div>
                        </>
                    }
                </Form>
            </Card>
        </Container>
    );
}
