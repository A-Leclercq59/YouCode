"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { updateUser } from "./settings.actions";
import { formSchemaUpdateUser } from "./updateUser.schema";
import { CheckCircle } from "lucide-react";

const FormSettings = ({
  userId,
  name,
  image,
}: {
  userId: string;
  name: string;
  image: string;
}) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchemaUpdateUser>>({
    resolver: zodResolver(formSchemaUpdateUser),
    mode: "onBlur",
    defaultValues: {
      name: "",
      image: "",
    },
  });

  useEffect(() => {
    form.setValue("name", name ?? "");
    form.setValue("image", image ?? "");
  }, [image, name, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit: SubmitHandler<z.infer<typeof formSchemaUpdateUser>> = async (
    values
  ) => {
    try {
      const result = await updateUser(values, userId);

      if (result.success) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.log(error);
    }
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
              <FormLabel>Image Url</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="Enter your image url"
                  {...field}
                />
              </FormControl>
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
                <Input
                  disabled={isLoading}
                  placeholder="Enter your name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isSuccess && (
          <Alert variant="success">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your informations has been successfully updated.
            </AlertDescription>
          </Alert>
        )}
        <Button disabled={isLoading}>Submit</Button>
      </form>
    </Form>
  );
};

export default FormSettings;
