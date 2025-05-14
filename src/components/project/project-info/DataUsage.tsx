import * as React from "react";
import { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { dataUsage } from "../../../graphql/queries";

export interface DataUsageProps {
  projectId: string;
}

export const DataUsage: React.FC<DataUsageProps> = ({ projectId }) => {
  const [dataUsed, setDataUsed] = useState("");

  useEffect(() => {
    (API.graphql({
      query: dataUsage,
      variables: {
        project: projectId,
      },
    }) as Promise<any>).then((res) => {
      if (res.data && res.data.dataUsage && res.data.dataUsage !== null) {
        const dataInGB = (parseFloat(res.data.dataUsage) / 1024 ** 3).toFixed(
          3
        );
        setDataUsed(dataInGB);
      }
    });
  }, [projectId]);

  return dataUsed === "" ? (
    <div>No data was uploaded this month</div>
  ) : (
    <div>Project data usage is {dataUsed} Giga Bytes</div>
  );
};
