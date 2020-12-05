import { Predicate } from '@angular/core';
import { HubConnectionBuilder } from '@microsoft/signalr';

export class Signalr<T> {
    private hubConnection: signalR.HubConnection;

    constructor(url: string) {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(url)
            .build();
    }

    register(methodName: string, method: Predicate<T>) {
        this.hubConnection.on(methodName, method);
    }

    start() {
        this.hubConnection
            .start()
            .then(() => console.log('connection started'))
            .catch(error => console.log('Error while starting connection: ' + error))
    }
}
