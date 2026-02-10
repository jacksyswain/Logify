import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { ExternalLink, Github } from "lucide-react";

export default function SaasCard({
  title,
  description,
  image,
  href,
  github,
}) {
  return (
    <Card className="group bg-white/5 border-white/10 backdrop-blur-xl text-white overflow-hidden transition-all hover:shadow-2xl hover:border-white/20">
      {/* Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <CardHeader>
        <CardTitle className="text-xl">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex justify-between items-center">
        <a
          href={href}
          className="text-sm font-medium text-white hover:underline"
        >
          Read More →
        </a>

        <div className="flex gap-3">
          {github && (
            <a href={github} target="_blank">
              <Github className="w-5 h-5 text-gray-400 hover:text-white" />
            </a>
          )}
          <a href={href} target="_blank">
            <ExternalLink className="w-5 h-5 text-gray-400 hover:text-white" />
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
