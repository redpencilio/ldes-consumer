import { newEngine, LDESClient, State } from "@treecg/actor-init-ldes-client";
import * as RDF from "rdf-js";
import PromiseQueue from "./promise-queue";
export type ConsumerArgs = {
  endpoint: string;
  requestHeaders?: { [key: string]: number | string | string[] };
  initialState?: State;
};

export type Member = {
  id: RDF.Term;
  quads: RDF.Quad[];
};

const UPDATE_QUEUE: PromiseQueue<void> = new PromiseQueue<void>();

export default class Consumer {
  private client: LDESClient;
  private requestHeaders: { [key: string]: number | string | string[] };
  private endpoint: string;
  private initialState: State | undefined;

  constructor({ endpoint, initialState, requestHeaders }: ConsumerArgs) {
    this.endpoint = endpoint;
    this.initialState = initialState;
    this.requestHeaders = requestHeaders ?? {};
    this.client = newEngine();
  }

  async listen(
    callback: (m: Member) => void | Promise<void>,
    onFinish: (s: State) => void | Promise<void>
  ) {
    const stream = this.client.createReadStream(
      this.endpoint,
      {
        representation: "Quads",
        mimeType: "application/ld+json",
        requestHeaders: this.requestHeaders,
        emitMemberOnce: true,
        disableSynchronization: false,
      },
      this.initialState
    );

    stream.on("data", async (member: Member) => {
      try {
        await UPDATE_QUEUE.push(async () => callback(member));
      } catch (e) {
        console.error(e);
      }
    });
    stream.on('now only syncing', () => {
      stream.pause();
  });
    stream.on("error", console.error);
    stream.on("pause", async () => {
      await UPDATE_QUEUE.push(async () => onFinish(stream.exportState()));
    });
    stream.on("end", async () => {
      await UPDATE_QUEUE.push(async () => onFinish(stream.exportState()));
    })
  }
}
