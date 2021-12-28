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

export const wrapper = <T>(promise : Promise<T>, options : Options) => PromiseOnSteroids<T>((res, rej) => promise.then(res, rej), options);

export const arrayWrapper = <T>(promises : Promise<T>[], options : Options) => {
    const result : Promise<T>[] = [];
    for(const P of promises) {
        result.push(wrapper(P, options));
    }

    return result;
}

export const all = <T>(promises : Promise<T>[], options : Options = {}) => Promise.all(arrayWrapper(promises, options));