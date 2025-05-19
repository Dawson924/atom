import { IPCServiceController, IPCService } from '../core';
import { ClientService } from '../client';

export class ClientServiceController extends IPCServiceController {
    protected override readonly namespace = 'client';
    protected override readonly ipc;
    protected clientService: ClientService;

    protected override async registerHandlers() {
        this.clientService = new ClientService();

        this.handle('folder', this.clientService.getFolder.bind(this.clientService));
        this.handle('get-versions', this.clientService.findVersions.bind(this.clientService));
        this.handle('get-version-manifest', this.clientService.fetchVersionManifest.bind(this.clientService));
        this.handle('get-fabric-artifacts', this.clientService.fetchFabricArtifact.bind(this.clientService));
        this.handle('find-java', async () => {
            return 'asd';
        });
        this.on('install-task', this.clientService.install.bind(this.clientService));
        this.handle('install-fabric', this.clientService.installFabric.bind(this.clientService));
        this.handle('launch', this.clientService.launch.bind(this.clientService));
    }

    constructor(ipc: IPCService) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}