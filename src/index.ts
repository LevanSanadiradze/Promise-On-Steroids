export interface Options {
    signal ?: AbortSignal;
    abortMessage ?: string;
}

export default function<T> (executor : (resolve : (value : T) => void, reject : (reason ?: any) => void, options ?: Options) => void, options : Options = {}) {
    const ABORT_MESSAGE = options.abortMessage ?? 'ABORTED';

    if(options.signal?.aborted) {
        return Promise.reject(ABORT_MESSAGE);
    }

    return new Promise<T>((res, rej) => {
        options.signal?.addEventListener('abort', () => {
            rej(ABORT_MESSAGE);
        });

        return executor(res, rej, options);
    });
}