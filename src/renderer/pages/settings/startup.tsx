import { ChangeEvent, useCallback } from 'react';
import { Card, CircleSpinner, Container, FormInput, List, RangeSlider } from '@renderer/components/commons';
import { useLaunchConfig } from '@renderer/hooks/config';

export default function StartupPage() {
    const { config, memory, loading, error, updateConfig } = useLaunchConfig();

    const handleFormChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateConfig({ [name]: value });
    }, [updateConfig]);

    const handleMemoryChange = useCallback((value: string) => {
        const newAllocated = parseFloat(value);
        updateConfig({ allocatedMemory: newAllocated });
    }, [updateConfig]);

    if (loading) return <CircleSpinner text="Loading..." />;
    if (error) return <div>{error}</div>;

    return (
        <Container>
            <Card title="Launch" className="mb-6">
                <List className="space-y-2">
                    <FormInput
                        title="Minecraft Folder"
                        name="minecraftFolder"
                        value={config.minecraftFolder}
                        onChange={handleFormChange}
                    />
                    <FormInput
                        title="Java Path"
                        name="javaPath"
                        value={config.javaPath}
                        onChange={handleFormChange}
                    />
                    <FormInput
                        title="JVM Arguments"
                        name="jvmArgs"
                        value={config.jvmArgs}
                        onChange={handleFormChange}
                    />
                    <FormInput
                        title="MC Arguments"
                        name="mcArgs"
                        value={config.mcArgs}
                        onChange={handleFormChange}
                    />
                </List>
            </Card>

            <Card
                title="Memory"
            >
                {memory.total && memory.usage && config.allocatedMemory >= 0 &&
                    <List>
                        {/* Allocated Memory Range Input */}
                        <div className="px-2 w-full h-8 flex flex-row space-x-3 items-center">
                            <div className="w-32 shrink-0">
                                <h3 className="text-sm text-gray-900 dark:text-gray-50 dark:bg-neutral-800 group">
                                    Allocated Memory
                                </h3>
                            </div>
                            <div className="flex flex-row items-center w-full min-w-80">
                                <RangeSlider
                                    min={0}
                                    max={memory.total}
                                    step={0.1}
                                    defaultValue={config.allocatedMemory}
                                    onChange={(e) => handleMemoryChange(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Memory Display Area */}
                        <div className="px-2 mt-4 mb-2 w-full h-9.5 flex flex-row space-x-3 items-center">
                            <div className="flex flex-row items-center w-full min-w-80">
                                {/* Memory used area */}
                                <div
                                    style={{
                                        width: `${(memory.usage / memory.total) * 100}%`,
                                        minWidth: '10%'
                                    }}
                                    className="relative h-1 shrink-0 transition-all duration-75 bg-blue-600"
                                >
                                    <label className="absolute -top-6 text-xs text-nowrap text-gray-600 dark:text-gray-300">
                                        Memory Usage
                                    </label>
                                    <label className="absolute -bottom-6 text-sm text-nowrap text-gray-800 dark:text-gray-400">
                                        {
                                            memory.usage / memory.total > .10 ? (
                                                `${memory.usage} GB / ${memory.total} GB`
                                            ) : (
                                                `~ / ${memory.total} GB`
                                            )
                                        }
                                    </label>
                                </div>
                                {/* Memory allocated area */}
                                <div className="relative h-1 w-full flex flex-row items-center bg-neutral-200 dark:bg-neutral-600">
                                    <label className="absolute -top-6 text-xs text-nowrap text-gray-600 dark:text-gray-300">
                                        Allocated Memory
                                    </label>
                                    <label className="absolute -bottom-6 text-sm text-nowrap text-gray-800 dark:text-gray-400">
                                        {config.allocatedMemory} GB
                                        {(config.allocatedMemory + memory.usage) >= memory.total &&
                                            ` (${(memory.total - memory.usage).toFixed(1)} available)`}
                                    </label>
                                    <div
                                        className="absolute top-0 left-0 h-1 transition-all duration-75 bg-blue-300"
                                        style={{
                                            width: `${(() => {
                                                const n = (config.allocatedMemory / (memory.total - memory.usage)) * 100;
                                                return n >= 100 ? 100 : n;
                                            })()}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </List>}
            </Card>
        </Container>
    );
}
