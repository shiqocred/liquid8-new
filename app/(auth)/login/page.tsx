"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCookies } from "next-client-cookies";

import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { baseUrl } from "@/lib/utils";

const formSchema = z.object({
  email: z.coerce.string().email({ message: "Email is required." }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

const LoginPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const cookies = useCookies();
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormSchema) => {
    try {
      const res = await axios.post(`${baseUrl}/login`, values);
      toast.success("Login Success");
      cookies.set("accessToken", res.data.data.resource[0]);
      cookies.set("profile", JSON.stringify(res.data.data.resource[1]));
      router.push("/");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="flex justify-center items-center h-full px-3 relative w-full">
      <div className="absolute left-0 h-3/5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          version="1.1"
          style={{
            shapeRendering: "geometricPrecision",
            textRendering: "geometricPrecision",
            fillRule: "evenodd",
            clipRule: "evenodd",
          }}
          viewBox="0 0 1220.41 1528.42"
        >
          <g>
            <path
              fillOpacity="0.2"
              fill="#38BDF8"
              d="M1067.86 1375.58l-152.55 -152.85 76.27 0c42.13,0 76.28,34.22 76.28,76.42l0 76.43z"
            />
            <path
              fillOpacity="0.102"
              fill="#38BDF8"
              d="M305.1 1528.42l152.55 -152.84 -76.27 0c-42.13,0 -76.28,34.21 -76.28,76.42l0 76.42z"
            />
            <path
              fillOpacity="0.102"
              fill="#38BDF8"
              d="M457.65 1375.58l152.56 -152.85 -76.28 0c-42.13,0 -76.28,34.22 -76.28,76.42l0 76.43z"
            />
            <path
              fillOpacity="0.2"
              fill="#38BDF8"
              d="M457.65 1375.58l-152.55 -152.85 76.28 0c42.12,0 76.27,34.22 76.27,76.42l0 76.43z"
            />
            <path
              fillOpacity="0.102"
              fill="#38BDF8"
              d="M305.1 1528.42l-152.55 -152.84 76.28 0c42.12,0 76.27,34.21 76.27,76.42l0 76.42z"
            />
            <path
              fill="#7DD3FC"
              d="M152.55 1375.58l152.55 -152.85 -76.27 0c-42.13,0 -76.28,34.22 -76.28,76.42l0 76.43z"
            />
            <path
              fill="#BAE6FD"
              d="M152.55 1375.58l-152.55 -152.85 76.28 0c42.12,0 76.27,34.22 76.27,76.42l0 76.43z"
            />
            <path
              fillOpacity="0.102"
              fill="#38BDF8"
              d="M1067.86 1069.89l152.55 -152.84 -76.27 0c-42.13,0 -76.28,34.21 -76.28,76.42l0 76.42z"
            />
            <path
              fill="#0284C7"
              d="M610.21 1222.73l152.55 -152.84 -76.28 0c-42.13,0 -76.27,34.22 -76.27,76.42l0 76.42z"
            />
            <path
              fillOpacity="0.4"
              fill="#38BDF8"
              d="M762.76 1069.89l152.55 -152.84 -76.28 0c-42.13,0 -76.27,34.21 -76.27,76.42l0 76.42z"
            />
            <path
              fill="#7DD3FC"
              d="M762.76 1069.89l-152.55 -152.84 76.27 0c42.13,0 76.28,34.21 76.28,76.42l0 76.42zm-152.55 152.84l-152.56 -152.84 76.28 0c42.13,0 76.28,34.22 76.28,76.42l0 76.42z"
            />
            <path
              fill="#0369A1"
              d="M305.1 1222.73l152.55 -152.84 -76.27 0c-42.13,0 -76.28,34.22 -76.28,76.42l0 76.42z"
            />
            <path
              fillOpacity="0.102"
              fill="#38BDF8"
              d="M457.65 1069.89l152.56 -152.84 -76.28 0c-42.13,0 -76.28,34.21 -76.28,76.42l0 76.42z"
            />
            <path
              fillOpacity="0.4"
              fill="#38BDF8"
              d="M457.65 1069.89l-152.55 -152.84 76.28 0c42.12,0 76.27,34.21 76.27,76.42l0 76.42z"
            />
            <path
              fill="#7DD3FC"
              d="M305.1 1222.73l-152.55 -152.84 76.28 0c42.12,0 76.27,34.22 76.27,76.42l0 76.42z"
            />
            <path
              fillOpacity="0.102"
              fill="#38BDF8"
              d="M0 1222.73l152.55 -152.84 -76.27 0c-42.13,0 -76.28,34.22 -76.28,76.42l0 76.42z"
            />
            <path
              fill="#38BDF8"
              d="M152.55 1069.89l152.55 -152.84 -76.27 0c-42.13,0 -76.28,34.21 -76.28,76.42l0 76.42z"
            />
            <path
              fill="#0284C7"
              d="M152.55 1069.89l-152.55 -152.84 76.28 0c42.12,0 76.27,34.21 76.27,76.42l0 76.42z"
            />
            <path
              fill="#38BDF8"
              d="M915.31 917.05l152.55 -152.84 -76.28 0c-42.12,0 -76.27,34.21 -76.27,76.42l0 76.42z"
            />
            <path
              fillOpacity="0.102"
              fill="#38BDF8"
              d="M915.31 917.05l-152.55 -152.84 76.27 0c42.13,0 76.28,34.21 76.28,76.42l0 76.42z"
            />
            <path
              fill="#BAE6FD"
              d="M610.21 917.05l152.55 -152.84 -76.28 0c-42.13,0 -76.27,34.21 -76.27,76.42l0 76.42z"
            />
            <path
              fill="#7DD3FC"
              d="M610.21 917.05l-152.56 -152.84 76.28 0c42.13,0 76.28,34.21 76.28,76.42l0 76.42zm-305.11 0l152.55 -152.84 -76.27 0c-42.13,0 -76.28,34.21 -76.28,76.42l0 76.42z"
            />
            <path
              fill="#38BDF8"
              d="M305.1 917.05l-152.55 -152.84 76.28 0c42.12,0 76.27,34.21 76.27,76.42l0 76.42z"
            />
            <path
              fill="#7DD3FC"
              d="M0 917.05l152.55 -152.84 -76.27 0c-42.13,0 -76.28,34.21 -76.28,76.42l0 76.42z"
            />
            <path
              fill="#7DD3FC"
              d="M152.55 152.84l152.55 152.84 -76.27 0c-42.13,0 -76.28,-34.21 -76.28,-76.42l0 -76.42z"
            />
            <path
              fill="#BAE6FD"
              d="M915.31 0l-152.55 152.84 76.27 0c42.13,0 76.28,-34.21 76.28,-76.42l0 -76.42z"
            />
            <path
              fillOpacity="0.4"
              fill="#38BDF8"
              d="M762.76 152.84l-152.55 152.84 76.27 0c42.13,0 76.28,-34.21 76.28,-76.42l0 -76.42z"
            />
            <path
              fill="#38BDF8"
              d="M762.76 152.84l152.55 152.84 -76.28 0c-42.13,0 -76.27,-34.21 -76.27,-76.42l0 -76.42z"
            />
            <path
              fillOpacity="0.102"
              fill="#38BDF8"
              d="M915.31 0l152.55 152.84 -76.28 0c-42.12,0 -76.27,-34.21 -76.27,-76.42l0 -76.42z"
            />
            <path
              fill="#7DD3FC"
              d="M1067.86 152.84l-152.55 152.84 76.27 0c42.13,0 76.28,-34.21 76.28,-76.42l0 -76.42z"
            />
            <path
              fill="#BAE6FD"
              d="M1067.86 152.84l152.55 152.84 -76.27 0c-42.13,0 -76.28,-34.21 -76.28,-76.42l0 -76.42z"
            />
            <path
              fillOpacity="0.102"
              fill="#38BDF8"
              d="M152.55 458.53l-152.55 152.84 76.28 0c42.12,0 76.27,-34.22 76.27,-76.42l0 -76.42z"
            />
            <path
              fill="#0284C7"
              d="M610.21 305.68l-152.56 152.85 76.28 0c42.13,0 76.28,-34.22 76.28,-76.43l0 -76.42z"
            />
            <path
              fillOpacity="0.4"
              fill="#38BDF8"
              d="M457.65 458.53l-152.55 152.84 76.28 0c42.12,0 76.27,-34.22 76.27,-76.42l0 -76.42z"
            />
            <path
              fill="#7DD3FC"
              d="M457.65 458.53l152.56 152.84 -76.28 0c-42.13,0 -76.28,-34.22 -76.28,-76.42l0 -76.42zm152.56 -152.85l152.55 152.85 -76.28 0c-42.13,0 -76.27,-34.22 -76.27,-76.43l0 -76.42z"
            />
            <path
              fill="#0369A1"
              d="M915.31 305.68l-152.55 152.85 76.27 0c42.13,0 76.28,-34.22 76.28,-76.43l0 -76.42z"
            />
            <path
              fillOpacity="0.102"
              fill="#38BDF8"
              d="M762.76 458.53l-152.55 152.84 76.27 0c42.13,0 76.28,-34.22 76.28,-76.42l0 -76.42z"
            />
            <path
              fillOpacity="0.4"
              fill="#38BDF8"
              d="M762.76 458.53l152.55 152.84 -76.28 0c-42.13,0 -76.27,-34.22 -76.27,-76.42l0 -76.42z"
            />
            <path
              fill="#7DD3FC"
              d="M915.31 305.68l152.55 152.85 -76.28 0c-42.12,0 -76.27,-34.22 -76.27,-76.43l0 -76.42z"
            />
            <path
              fillOpacity="0.102"
              fill="#38BDF8"
              d="M1220.41 305.68l-152.55 152.85 76.28 0c42.12,0 76.27,-34.22 76.27,-76.43l0 -76.42z"
            />
            <path
              fill="#7DD3FC"
              d="M1067.86 458.53l-152.55 152.84 76.27 0c42.13,0 76.28,-34.22 76.28,-76.42l0 -76.42z"
            />
            <path
              fill="#0284C7"
              d="M1067.86 458.53l152.55 152.84 -76.27 0c-42.13,0 -76.28,-34.22 -76.28,-76.42l0 -76.42z"
            />
            <path
              fill="#38BDF8"
              d="M305.1 611.37l-152.55 152.84 76.28 0c42.12,0 76.27,-34.21 76.27,-76.42l0 -76.42z"
            />
            <path
              fillOpacity="0.102"
              fill="#38BDF8"
              d="M305.1 611.37l152.55 152.84 -76.27 0c-42.13,0 -76.28,-34.21 -76.28,-76.42l0 -76.42z"
            />
            <path
              fill="#BAE6FD"
              d="M610.21 611.37l-152.56 152.84 76.28 0c42.13,0 76.28,-34.21 76.28,-76.42l0 -76.42z"
            />
            <path
              fill="#7DD3FC"
              d="M610.21 611.37l152.55 152.84 -76.28 0c-42.13,0 -76.27,-34.21 -76.27,-76.42l0 -76.42zm305.1 0l-152.55 152.84 76.27 0c42.13,0 76.28,-34.21 76.28,-76.42l0 -76.42z"
            />
            <path
              fill="#38BDF8"
              d="M915.31 611.37l152.55 152.84 -76.28 0c-42.12,0 -76.27,-34.21 -76.27,-76.42l0 -76.42z"
            />
            <path
              fill="#7DD3FC"
              d="M1220.41 611.37l-152.55 152.84 76.28 0c42.12,0 76.27,-34.21 76.27,-76.42l0 -76.42z"
            />
          </g>
        </svg>
      </div>
      <div className="absolute right-0 h-3/5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          version="1.1"
          style={{
            shapeRendering: "geometricPrecision",
            textRendering: "geometricPrecision",
            fillRule: "evenodd",
            clipRule: "evenodd",
          }}
          viewBox="0 0 630.15 789.18"
        >
          <g>
            <path
              fill="#38BDF8"
              fillOpacity="0.2"
              d="M78.77 710.27l78.77 -78.92 -39.39 0c-21.75,0 -39.38,17.66 -39.38,39.46l0 39.46z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.102"
              d="M472.61 789.18l-78.77 -78.91 39.39 0c21.75,0 39.38,17.66 39.38,39.45l0 39.46z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.102"
              d="M393.84 710.27l-78.77 -78.92 39.39 0c21.75,0 39.38,17.66 39.38,39.46l0 39.46z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.2"
              d="M393.84 710.27l78.77 -78.92 -39.38 0c-21.75,0 -39.39,17.66 -39.39,39.46l0 39.46z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.102"
              d="M472.61 789.18l78.77 -78.91 -39.38 0c-21.76,0 -39.39,17.66 -39.39,39.45l0 39.46z"
            />
            <path
              fill="#7DD3FC"
              d="M551.38 710.27l-78.77 -78.92 39.39 0c21.75,0 39.38,17.66 39.38,39.46l0 39.46z"
            />
            <path
              fill="#BAE6FD"
              d="M551.38 710.27l78.77 -78.92 -39.39 0c-21.75,0 -39.38,17.66 -39.38,39.46l0 39.46z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.102"
              d="M78.77 552.43l-78.77 -78.92 39.38 0c21.76,0 39.39,17.67 39.39,39.46l0 39.46z"
            />
            <path
              fill="#0284C7"
              d="M315.07 631.35l-78.76 -78.92 39.38 0c21.75,0 39.38,17.66 39.38,39.46l0 39.46z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.4"
              d="M236.31 552.43l-78.77 -78.92 39.38 0c21.75,0 39.39,17.67 39.39,39.46l0 39.46z"
            />
            <path
              fill="#7DD3FC"
              d="M236.31 552.43l78.76 -78.92 -39.38 0c-21.75,0 -39.38,17.67 -39.38,39.46l0 39.46zm78.76 78.92l78.77 -78.92 -39.38 0c-21.75,0 -39.39,17.66 -39.39,39.46l0 39.46z"
            />
            <path
              fill="#0369A1"
              d="M472.61 631.35l-78.77 -78.92 39.39 0c21.75,0 39.38,17.66 39.38,39.46l0 39.46z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.102"
              d="M393.84 552.43l-78.77 -78.92 39.39 0c21.75,0 39.38,17.67 39.38,39.46l0 39.46z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.4"
              d="M393.84 552.43l78.77 -78.92 -39.38 0c-21.75,0 -39.39,17.67 -39.39,39.46l0 39.46z"
            />
            <path
              fill="#7DD3FC"
              d="M472.61 631.35l78.77 -78.92 -39.38 0c-21.76,0 -39.39,17.66 -39.39,39.46l0 39.46z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.102"
              d="M630.15 631.35l-78.77 -78.92 39.38 0c21.76,0 39.39,17.66 39.39,39.46l0 39.46z"
            />
            <path
              fill="#38BDF8"
              d="M551.38 552.43l-78.77 -78.92 39.39 0c21.75,0 39.38,17.67 39.38,39.46l0 39.46z"
            />
            <path
              fill="#0284C7"
              d="M551.38 552.43l78.77 -78.92 -39.39 0c-21.75,0 -39.38,17.67 -39.38,39.46l0 39.46z"
            />
            <path
              fill="#38BDF8"
              d="M157.54 473.51l-78.77 -78.92 39.38 0c21.76,0 39.39,17.67 39.39,39.46l0 39.46z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.102"
              d="M157.54 473.51l78.77 -78.92 -39.39 0c-21.75,0 -39.38,17.67 -39.38,39.46l0 39.46z"
            />
            <path
              fill="#BAE6FD"
              d="M315.07 473.51l-78.76 -78.92 39.38 0c21.75,0 39.38,17.67 39.38,39.46l0 39.46z"
            />
            <path
              fill="#7DD3FC"
              d="M315.07 473.51l78.77 -78.92 -39.38 0c-21.75,0 -39.39,17.67 -39.39,39.46l0 39.46zm157.54 0l-78.77 -78.92 39.39 0c21.75,0 39.38,17.67 39.38,39.46l0 39.46z"
            />
            <path
              fill="#38BDF8"
              d="M472.61 473.51l78.77 -78.92 -39.38 0c-21.76,0 -39.39,17.67 -39.39,39.46l0 39.46z"
            />
            <path
              fill="#7DD3FC"
              d="M630.15 473.51l-78.77 -78.92 39.38 0c21.76,0 39.39,17.67 39.39,39.46l0 39.46z"
            />
            <path
              fill="#7DD3FC"
              d="M551.38 78.92l-78.77 78.92 39.39 0c21.75,0 39.38,-17.67 39.38,-39.46l0 -39.46z"
            />
            <path
              fill="#BAE6FD"
              d="M157.54 0l78.77 78.92 -39.39 0c-21.75,0 -39.38,-17.67 -39.38,-39.46l0 -39.46z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.4"
              d="M236.31 78.92l78.76 78.92 -39.38 0c-21.75,0 -39.38,-17.67 -39.38,-39.46l0 -39.46z"
            />
            <path
              fill="#38BDF8"
              d="M236.31 78.92l-78.77 78.92 39.38 0c21.75,0 39.39,-17.67 39.39,-39.46l0 -39.46z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.102"
              d="M157.54 0l-78.77 78.92 39.38 0c21.76,0 39.39,-17.67 39.39,-39.46l0 -39.46z"
            />
            <path
              fill="#7DD3FC"
              d="M78.77 78.92l78.77 78.92 -39.39 0c-21.75,0 -39.38,-17.67 -39.38,-39.46l0 -39.46z"
            />
            <path
              fill="#BAE6FD"
              d="M78.77 78.92l-78.77 78.92 39.38 0c21.76,0 39.39,-17.67 39.39,-39.46l0 -39.46z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.102"
              d="M551.38 236.76l78.77 78.91 -39.39 0c-21.75,0 -39.38,-17.66 -39.38,-39.46l0 -39.45z"
            />
            <path
              fill="#0284C7"
              d="M315.07 157.84l78.77 78.92 -39.38 0c-21.75,0 -39.39,-17.67 -39.39,-39.46l0 -39.46z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.4"
              d="M393.84 236.76l78.77 78.91 -39.38 0c-21.75,0 -39.39,-17.66 -39.39,-39.46l0 -39.45z"
            />
            <path
              fill="#7DD3FC"
              d="M393.84 236.76l-78.77 78.91 39.39 0c21.75,0 39.38,-17.66 39.38,-39.46l0 -39.45zm-78.77 -78.92l-78.76 78.92 39.38 0c21.75,0 39.38,-17.67 39.38,-39.46l0 -39.46z"
            />
            <path
              fill="#0369A1"
              d="M157.54 157.84l78.77 78.92 -39.39 0c-21.75,0 -39.38,-17.67 -39.38,-39.46l0 -39.46z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.102"
              d="M236.31 236.76l78.76 78.91 -39.38 0c-21.75,0 -39.38,-17.66 -39.38,-39.46l0 -39.45z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.4"
              d="M236.31 236.76l-78.77 78.91 39.38 0c21.75,0 39.39,-17.66 39.39,-39.46l0 -39.45z"
            />
            <path
              fill="#7DD3FC"
              d="M157.54 157.84l-78.77 78.92 39.38 0c21.76,0 39.39,-17.67 39.39,-39.46l0 -39.46z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.102"
              d="M0 157.84l78.77 78.92 -39.39 0c-21.75,0 -39.38,-17.67 -39.38,-39.46l0 -39.46z"
            />
            <path
              fill="#7DD3FC"
              d="M78.77 236.76l78.77 78.91 -39.39 0c-21.75,0 -39.38,-17.66 -39.38,-39.46l0 -39.45z"
            />
            <path
              fill="#0284C7"
              d="M78.77 236.76l-78.77 78.91 39.38 0c21.76,0 39.39,-17.66 39.39,-39.46l0 -39.45z"
            />
            <path
              fill="#38BDF8"
              d="M472.61 315.67l78.77 78.92 -39.38 0c-21.76,0 -39.39,-17.66 -39.39,-39.46l0 -39.46z"
            />
            <path
              fill="#38BDF8"
              fillOpacity="0.102"
              d="M472.61 315.67l-78.77 78.92 39.39 0c21.75,0 39.38,-17.66 39.38,-39.46l0 -39.46z"
            />
            <path
              fill="#BAE6FD"
              d="M315.07 315.67l78.77 78.92 -39.38 0c-21.75,0 -39.39,-17.66 -39.39,-39.46l0 -39.46z"
            />
            <path
              fill="#7DD3FC"
              d="M315.07 315.67l-78.76 78.92 39.38 0c21.75,0 39.38,-17.66 39.38,-39.46l0 -39.46zm-157.53 0l78.77 78.92 -39.39 0c-21.75,0 -39.38,-17.66 -39.38,-39.46l0 -39.46z"
            />
            <path
              fill="#38BDF8"
              d="M157.54 315.67l-78.77 78.92 39.38 0c21.76,0 39.39,-17.66 39.39,-39.46l0 -39.46z"
            />
            <path
              fill="#7DD3FC"
              d="M0 315.67l78.77 78.92 -39.39 0c-21.75,0 -39.38,-17.66 -39.38,-39.46l0 -39.46z"
            />
          </g>
        </svg>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="jhon@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          {...field}
                          type={isVisible ? "text" : "password"}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3"
                          onClick={() => setIsVisible(!isVisible)}
                        >
                          {isVisible ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-sky-500/70 hover:bg-sky-500 text-black"
              >
                Sign in
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
