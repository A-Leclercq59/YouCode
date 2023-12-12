import { useEffect, useState } from "react";

export type BreadcrumbItemProps = {
  model: string;
  prismaId: string;
};

export const BreadcrumbItem = ({ model, prismaId }: BreadcrumbItemProps) => {
  const [name, setName] = useState("");

  const fetcher = async (model: string, prismaId: string) => {
    const response = await fetch(`/api/${model}/${prismaId}`);
    const data = await response.json();

    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetcher(model, prismaId);
      setName(data.name);
    };

    fetchData();
  }, [model, prismaId]);

  return <span>{name}</span>;
};
