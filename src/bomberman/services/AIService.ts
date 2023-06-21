import {IControlsStates} from "../Controls";

export interface IModelState {
    x: number;
    y: number;
    bombs: number;
    left: number;
    right: number;
    up: number;
    down: number;
    center: number;
}

export class AIService {
    private readonly url: string;

    constructor(url: string = "http://localhost:8080") {
        this.url = url;
    }

    async sendState(state: IModelState): Promise<IControlsStates> {
        const result = await fetch(this.url, {body: JSON.stringify(state), method: "POST"});
        return result.json();
    }
}