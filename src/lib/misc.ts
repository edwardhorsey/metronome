export function wait(milliseconds: number) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(undefined), milliseconds);
    });
}
