export interface Options {
    signal ?: AbortSignal;
    abortMessage ?: string;
}

const PromiseOnSteroids = <T>(executor : (resolve : (value : T | PromiseLike<T>) => void, reject : (reason ?: any) => void, options : Options) => void, options : Options = {}) => {
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

export default PromiseOnSteroids;

export const wrapper = (promises : Promise<any>[], options : Options) => {
    const result : Promise<any>[] = [];
    for(const P of promises) {
        result.push(PromiseOnSteroids((res, rej) => P.then(res, rej), options));
    }

    return result;
}

export const all = (promises : Promise<any>[], options : Options = {}) => Promise.all(wrapper(promises, options));