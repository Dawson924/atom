import MinecraftIcon from '../../assets/images/minecraft/grass_block.png';
import CommandBlock from '../../assets/images/minecraft/command_block.png';

import { useEffect, useState } from 'react';
import { MinecraftVersion, MinecraftVersionList } from '@xmcl/installer';
import { toUTCStringPretty } from '../../../common/utils/date';
import { Accordion, Card, Container, List, ListItem } from '@renderer/components/commons';
import ClientInfoPage from './client-info';
import { ClientService } from '@renderer/api';
import { useInstallPage } from '@renderer/hooks/store';

export default function ClientPage() {
    const { goTo } = useInstallPage(state => state);

    const [versionList, setVersionList] = useState<MinecraftVersionList>();
    const [expanded, setExpanded] = useState('minecraft');

    useEffect(() => {
        const initialize = async () => {
            const [versionManifest] = await Promise.all([
                ClientService.getVersionManifest(),
            ]);
            setVersionList(versionManifest);
        };

        initialize();
    }, []);

    if (!versionList) return null;

    return (
        <>
            <Container>
                {/* Latest */}
                <Card
                    title="Latest"
                    className="mb-6 animate-[slide-down_0.1s_ease-in]"
                >
                    {/* Minecraft latest release & preview version */}
                    <List>
                        <ListItem
                            src={MinecraftIcon}
                            title={versionList.latest.release}
                            description={`Release version, ${toUTCStringPretty(versionList.versions.find(ver => ver.id === versionList.latest.release).releaseTime)}`}
                            onClick={() => goTo(<ClientInfoPage version={versionList.latest.release} />)}
                        />
                        <ListItem
                            src={CommandBlock}
                            title={versionList.latest.snapshot}
                            description={`Snapshot version, ${toUTCStringPretty(versionList.versions.find(ver => ver.id === versionList.latest.snapshot).releaseTime)}`}
                            onClick={() => goTo(<ClientInfoPage version={versionList.latest.release} />)}
                        />
                    </List>
                </Card>
                {/* Minecraft Releases */}
                <Accordion
                    title={`Release (${versionList.versions.length})`}
                    open={expanded === 'minecraft'}
                    className="animate-[slide-down_0.4s_ease-in]"
                    onClick={() => setExpanded(prev => prev !== 'minecraft' ? 'minecraft' : null)}
                >
                    {versionList.versions.filter(ver => ver.type === 'release').map((version: MinecraftVersion, index) => {
                        return (
                            <ListItem
                                key={`${version.id}_${index}`}
                                src={MinecraftIcon}
                                title={version.id}
                                description={toUTCStringPretty(version.releaseTime)}
                                onClick={() => goTo(<ClientInfoPage version={version.id} />)}
                            />
                        );
                    })}
                </Accordion>
            </Container>
        </>
    );
}
