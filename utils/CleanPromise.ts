export const CleanPromise = async <T, E = Error>(
  promise: Promise<T>
): Promise<[T | null, E | any | null]> => {
  try {
    const Results = await promise;
    return [Results, null];
  } catch (err) {
    return [null, err];
  }
};
