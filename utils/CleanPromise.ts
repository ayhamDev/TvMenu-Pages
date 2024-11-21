export const CleanPromise = async <T, E = Error>(
  promise: Promise<T>
): Promise<[T | null, E | null]> => {
  try {
    const Results = await promise;
    return [Results, null];
  } catch (err) {
    // @ts-ignore
    return [null, err];
  }
};
