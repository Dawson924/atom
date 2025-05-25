import { IPCServiceController, IPCService } from '../core';
import { ClientService } from '../services/client';

export class ClientServiceController extends IPCServiceController {
    protected override readonly namespace = 'client';
    protected override readonly ipc;
    protected clientService: ClientService;

    protected override async registerHandlers() {
        const clientService = new ClientService();

        this.handle('folder', clientService.getFolder.bind(clientService));
        this.handle('get-versions', clientService.findVersions.bind(clientService));
        this.handle('get-version-manifest', clientService.fetchVersionManifest.bind(clientService));
        this.handle('get-fabric-artifacts', clientService.fetchFabricArtifact.bind(clientService));
        this.handle('find-java', clientService.findJava.bind(clientService));
        this.handle('install', clientService.install.bind(clientService));
        this.handle('install-fabric', clientService.installFabric.bind(clientService));
        this.handle('launch', clientService.launch.bind(clientService));
    }

    constructor(ipc: IPCService) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}