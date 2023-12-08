"use client";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { lessonActionCreate, lessonActionEditDetails } from "../lesson.action";
import { LESSON_STATE, LessonDetailSchema } from "./lesson.schema";

export type LessonDetailFormProps = {
  courseId?: string;
  defaultValue?: LessonDetailSchema & {
    id: string;
  };
};

export const LessonDetail = ({
  courseId,
  defaultValue,
}: LessonDetailFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof LessonDetailSchema>>({
    resolver: zodResolver(LessonDetailSchema),
    defaultValues: defaultValue,
  });

  const onSubmit: SubmitHandler<z.infer<typeof LessonDetailSchema>> = async (
    values
  ) => {
    const { data, serverError } = defaultValue?.id
      ? await lessonActionEditDetails({
          lessonId: defaultValue.id,
          data: values,
        })
      : await lessonActionCreate({
          courseId: courseId || "",
          data: values,
        });

    if (data) {
      toast.success(data.message);
      router.push(`/admin/courses/${data.lesson.courseId}/lessons`);
      router.refresh();
      return;
    }

    toast.error("Some error occurred", {
      description: serverError,
    });
    return;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="NextReact" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {LESSON_STATE.map((state) => (
                    <SelectItem
                      key={state}
                      value={state}
                      className="capitalize"
                    >
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
