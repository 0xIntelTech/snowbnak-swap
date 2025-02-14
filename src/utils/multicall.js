import httpProvider from "./providerHelpers";
import { Multicall } from "ethereum-multicall";
// Addresses
const multicall = async (abi, calls) => {
  try {
    const multicall = new Multicall({
      ethersProvider: httpProvider,
      tryAggregate: true,
    });

    const contractCallContext = [];

    calls.map((call, i) =>
      contractCallContext.push({
        reference: call.name + i,
        contractAddress: call.address,
        abi: abi || call.abi,
        calls: [
          {
            reference: call.name + i,
            methodName: call.name,
            methodParameters: call.params,
          },
        ],
      })
    );
    const returnData = await multicall.call(contractCallContext);
    let res;
    if (returnData && returnData.results)
      res = calls.map(
        (call, i) =>
          returnData.results[call.name + i].callsReturnContext[0].returnValues
      );
    return res;
  } catch (error) {
    console.log("multicall:", error);
    throw new Error(error);
  }
};

export default multicall;
