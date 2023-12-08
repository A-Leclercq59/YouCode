"use client";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { courseActionCreate, courseActionEdit } from "./course.action";
import { CourseFormSchema } from "./course.schema";

import { zodResolver } from "@hookform/resolvers/zod";

export type CourseFormProps = {
  defaultValue?: CourseFormSchema & {
    id: string;
  };
};

export const CourseForm = ({ defaultValue }: CourseFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof CourseFormSchema>>({
    resolver: zodResolver(CourseFormSchema),
    defaultValues: defaultValue,
  });

  const onSubmit: SubmitHandler<z.infer<typeof CourseFormSchema>> = async (
    values
  ) => {
    const { data, serverError } = defaultValue?.id
      ? await courseActionEdit({
          courseId: defaultValue.id,
          data: values,
        })
      : await courseActionCreate(values);

    if (data) {
      toast.success(data.message);
      router.push(`/admin/courses/${data.course.id}`);
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
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input placeholder="https://googleimage.com" {...field} />
              </FormControl>
              <FormDescription>
                Host and use an image. You can use
                <Link href="https://imgur.com">Imgur</Link> to host your image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="presentation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Presentation</FormLabel>
              <FormControl>
                <Textarea placeholder="## Some title" {...field} />
              </FormControl>
              <FormDescription>Markdown is supported.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </Form>
  );
};
