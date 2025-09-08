import MinecraftIcon from '../../../assets/images/minecraft/grass_block.png';
import CommandBlock from '../../../assets/images/minecraft/command_block.png';
import { useEffect, useState } from 'react';
import { MinecraftVersion, MinecraftVersionList } from '@xmcl/installer';
import { toUTCStringPretty } from '@common/utils/date';
import { Accordion, Card, Container, List, ListItem } from '@renderer/components/commons';
import { ClientVersionDetail } from './detail';
import { ClientService } from '@renderer/api';
import { useInstallPage } from '@renderer/hooks/store';
import { useTranslation } from 'react-i18next';
import { Motion } from '@renderer/components/animation';

export function ClientVersionList() {
    const { goTo } = useInstallPage(state => state);
    const { t } = useTranslation();

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
                <Motion animation="animate-[slide-down_0.1s_ease-in]">
                    <Card
                        title={t('label.latest')}
                        className="mb-6"
                    >
                        {/* Minecraft latest release & preview version */}
                        <List>
                            <ListItem
                                src={MinecraftIcon}
                                title={versionList.latest.release}
                                description={`Release version, ${toUTCStringPretty(versionList.versions.find(ver => ver.id === versionList.latest.release).releaseTime)}`}
                                onClick={() => goTo(<ClientVersionDetail version={versionList.latest.release} />)}
                            />
                            <ListItem
                                src={CommandBlock}
                                title={versionList.latest.snapshot}
                                description={`Snapshot version, ${toUTCStringPretty(versionList.versions.find(ver => ver.id === versionList.latest.snapshot).releaseTime)}`}
                                onClick={() => goTo(<ClientVersionDetail version={versionList.latest.release} />)}
                            />
                        </List>
                    </Card>
                </Motion>
                {/* Minecraft Releases */}
                <Motion animation="animate-[slide-down_0.4s_ease-in]">
                    <Accordion
                        title={`${t('label.release')} (${versionList.versions.length})`}
                        open={expanded === 'minecraft'}
                        onClick={() => setExpanded(prev => prev !== 'minecraft' ? 'minecraft' : null)}
                    >
                        {versionList.versions.filter(ver => ver.type === 'release').map((version: MinecraftVersion, index) => {
                            return (
                                <ListItem
                                    key={`${version.id}_${index}`}
                                    src={MinecraftIcon}
                                    title={version.id}
                                    description={toUTCStringPretty(version.releaseTime)}
                                    onClick={() => goTo(<ClientVersionDetail version={version.id} />)}
                                />
                            );
                        })}
                    </Accordion>
                </Motion>
            </Container>
        </>
    );
}
