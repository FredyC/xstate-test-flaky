type TCacheStatus = "pending" | "success" | "failure";

export function createSimpleSuspense<TValue = unknown>(
  promise: Promise<TValue>
) {
  let status: TCacheStatus = "pending";
  let resolvedValue: TValue;
  let rejection: Error;

  promise.then(handleResolve).catch(handleReject);

  function handleResolve(value: TValue) {
    resolvedValue = value;
    status = "success";
  }

  function handleReject(error: any) {
    if ("then" in error) {
      rejection = new Error("Simple suspense caught Promise and that is FAIL");
    } else if (error instanceof Error) {
      rejection = error;
    } else {
      rejection = new Error(error);
    }
    status = "failure";
  }

  function read() {
    if (status === "pending") {
      throw promise;
    }
    if (status === "failure") {
      throw rejection;
    }
    return resolvedValue;
  }

  return { read };
}
