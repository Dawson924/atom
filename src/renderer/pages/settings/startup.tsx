import { ChangeEvent, useEffect, useState } from 'react';
import { Card, Container, Form, FormInput } from '@renderer/components/commons';
import { convertUnitsPrecise } from '@common/utils/byte';
import { ConfigService, SystemService } from '@renderer/api';

const convertByteToGB = (bytes: number) => convertUnitsPrecise(bytes, 'B', 'GB', 1024, 1);
const convertGBToMB = (gigabytes: number) => convertUnitsPrecise(gigabytes, 'GB', 'MB', 1024, 0);

export default function StartupPage() {
    const [minecraftFolder, setMinecraftFolder] = useState<string>('');
    const [javaPath, setJavaPath] = useState<string>('');
    const [jvmArgs, setJvmArgs] = useState<string>('');
    const [mcArgs, setMcArgs] = useState<string>('');
    const [allocatedMemory, setAllocatedMemory] = useState<number>();
    const [memoryUsage, setMemoryUsage] = useState<number>();
    const [totalMemory, setTotalMemory] = useState<number>();

    useEffect(() => {
        const loadConfig = async () => {
            const [
                minecraftFolder,
                javaPath,
                allocatedMemory,
                jvmArgs,
                mcArgs,
                totalMemory,
                memoryUsage,
            ] = await Promise.all([
                ConfigService.get('launch.minecraftFolder'),
                ConfigService.get('launch.runtime.executable'),
                ConfigService.get('launch.runtime.allocatedMemory'),
                ConfigService.get('launch.extraArguments.jvm'),
                ConfigService.get('launch.extraArguments.mc'),
                SystemService.totalMemory(),
                SystemService.memoryUsage(),
            ]);

            // Validate initial values
            const adjustedAllocated = convertUnitsPrecise(allocatedMemory, 'MB', 'GB');
            const adjustedTotal = convertByteToGB(totalMemory);
            const adjustedUsage = convertByteToGB(memoryUsage);

            setMinecraftFolder(minecraftFolder);
            setJavaPath(javaPath);
            setAllocatedMemory(adjustedAllocated);
            setJvmArgs(jvmArgs);
            setMcArgs(mcArgs);
            setTotalMemory(adjustedTotal);
            setMemoryUsage(adjustedUsage);
        };

        loadConfig();
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const [usage, total] = await Promise.all([
                    SystemService.memoryUsage(),
                    SystemService.totalMemory()
                ]);

                setMemoryUsage(convertByteToGB(usage));
                setTotalMemory(convertByteToGB(total));
            } catch (error) {
                console.error('Failed to update memory usage:', error);
            }
        }, 1000); // 每秒更新一次

        return () => clearInterval(interval);
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        ConfigService.set(`launch.${e.target.name}`, value);
    };

    const changeAllocatedMemory = (e: ChangeEvent<HTMLInputElement>) => {
        const newAllocated = parseFloat(e.target.value);
        setAllocatedMemory(newAllocated);
        ConfigService.set('launch.runtime.allocatedMemory', convertGBToMB(newAllocated));
    };

    return (
        <Container>
            <Card
                title="Launch"
                className="mb-6"
            >
                <Form>
                    <FormInput
                        title="Minecraft Folder"
                        name="minecraftFolder"
                        value={minecraftFolder}
                        onChange={handleChange}
                    />
                    <FormInput
                        title="Java Path"
                        name="runtime.executable"
                        value={javaPath}
                        onChange={handleChange}
                    />
                    <FormInput
                        title="JVM Arguments"
                        name="extraArguments.jvm"
                        value={jvmArgs}
                        onChange={handleChange}
                    />
                    <FormInput
                        title="MC Arguments"
                        name="extraArguments.mc"
                        value={mcArgs}
                        onChange={handleChange}
                    />
                </Form>
            </Card>
            <Card
                title="Memory"
            >
                {totalMemory && memoryUsage && allocatedMemory >= 0 &&
                    <Form>
                        {/* Allocated Memory Range Input */}
                        <div className="px-2 w-full h-8 flex flex-row space-x-3 items-center">
                            <div className="w-32 shrink-0">
                                <h3 className="text-sm text-gray-900 dark:text-gray-50 dark:bg-neutral-800 group">
                                    Allocated Memory
                                </h3>
                            </div>
                            <div className="flex flex-row items-center w-full min-w-80">
                                <input
                                    type="range"
                                    className="transparent h-1 w-full cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600"
                                    min={0}
                                    max={totalMemory}
                                    step={0.1}
                                    defaultValue={allocatedMemory}
                                    onChange={changeAllocatedMemory}
                                />
                            </div>
                        </div>

                        {/* Memory Display Area */}
                        <div className="px-2 mt-4 mb-2 w-full h-9.5 flex flex-row space-x-3 items-center">
                            <div className="flex flex-row items-center w-full min-w-80">
                                {/* Memory used area */}
                                <div
                                    style={{ width: `${(memoryUsage / totalMemory) * 100}%` }}
                                    className="relative h-1 shrink-0 transition-all duration-75 bg-blue-600"
                                >
                                    <label className="absolute -top-6 text-xs text-nowrap text-gray-600 dark:text-gray-300">
                                        Memory Usage
                                    </label>
                                    <label className="absolute -bottom-6 text-sm text-nowrap text-gray-800 dark:text-gray-400">
                                        {memoryUsage} GB / {totalMemory} GB
                                    </label>
                                </div>
                                {/* Memory allocated area */}
                                <div className="relative h-1 w-full flex flex-row items-center bg-neutral-200 dark:bg-neutral-600">
                                    <label className="absolute -top-6 text-xs text-nowrap text-gray-600 dark:text-gray-300">
                                        Allocated Memory
                                    </label>
                                    <label className="absolute -bottom-6 text-sm text-nowrap text-gray-800 dark:text-gray-400">
                                        {
                                            allocatedMemory} GB {(allocatedMemory + memoryUsage) >= totalMemory &&
                                                ` (${(totalMemory - memoryUsage).toFixed(1)} available)`
                                        }
                                    </label>
                                    <div
                                        className="absolute top-0 left-0 h-1 transition-all duration-75 bg-blue-300"
                                        style={{ width: `${(() => {
                                            const n = (allocatedMemory / (totalMemory - memoryUsage)) * 100;
                                            return n >= 100 ? 100 : n;
                                        })()}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Form>}
            </Card>
        </Container>
    );
}
