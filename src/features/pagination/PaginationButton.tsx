"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export type CoursePaginationButtonProps = {
  totalPage: number;
  page: number;
  baseUrl: string;
};

const CoursePaginationButton = (props: CoursePaginationButtonProps) => {
  const router = useRouter();
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        disabled={props.page === 0}
        size="sm"
        onClick={() => {
          const searchParams = new URLSearchParams({
            page: String(props.page - 1),
          });
          const url = `${props.baseUrl}?${searchParams.toString()}`;
          router.push(url);
        }}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={props.page === props.totalPage}
        onClick={() => {
          const searchParams = new URLSearchParams({
            page: String(props.page + 1),
          });
          const url = `${props.baseUrl}?${searchParams.toString()}`;
          router.push(url);
        }}
      >
        Next
      </Button>
    </div>
  );
};

export default CoursePaginationButton;
