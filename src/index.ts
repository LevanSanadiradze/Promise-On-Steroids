export interface Options {
    signal ?: AbortSignal
}

const ABORTED = 'ABORTED';

export default function<T> (executor : (resolve: (value: T) => void, reject: (reason?: any) => void) => void, options : Options = {}) {
    if(options.signal?.aborted) {
        return Promise.reject(ABORTED);
    }

    return new Promise<T>((res, rej) => {
        options.signal?.addEventListener('abort', () => {
            rej(ABORTED);
        });

        return executor(res, rej);
    });
}