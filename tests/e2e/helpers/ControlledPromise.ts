interface ControlledPromise<T> extends Promise<T> {
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}
export function createControlledPromise<T = void>(): ControlledPromise<T> {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;
  
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    return Object.defineProperties(promise as ControlledPromise<T>, {
        resolve: { get: () => resolve },
        reject: { get: () => reject },
    })
}