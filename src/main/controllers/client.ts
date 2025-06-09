import { IPCServiceController, IPCService } from '../core';
import { ClientService } from '../services/client';

export class ClientServiceController extends IPCServiceController {
    protected override readonly namespace = 'client';
    protected override readonly ipc;
    protected clientService: ClientService;

    protected override async registerHandlers() {
        const service = new ClientService();

        this.handle('folder', service.getFolder.bind(service));
        this.handle('get-path', service.getPath.bind(service));
        this.handle('get-versions', service.getVersions.bind(service));
        this.handle('has-version', service.hasVersion.bind(service));
        this.handle('get-version-manifest', service.getVersionManifest.bind(service));
        this.handle('get-fabric-artifacts', service.getFabricArtifact.bind(service));
        this.handle('find-java', service.findJava.bind(service));
        this.handle('install', service.install.bind(service));
        this.handle('install-fabric', service.installFabric.bind(service));
        this.handle('download-file', service.downloadFile.bind(service));
        this.handle('launch', service.launch.bind(service));
    }

    constructor(ipc: IPCService) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}