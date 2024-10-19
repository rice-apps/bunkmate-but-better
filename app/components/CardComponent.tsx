import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";


interface TodoProps {
  title: string,
  description: string,
  onComplete: React.MouseEventHandler<HTMLButtonElement>
}

const ToDoCard = ({ title, description, onComplete }: TodoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="bg-black text-white border-black hover:bg-gray-800" variant="outline" onClick={onComplete}>
          Completed
        </Button>
      </CardFooter>
    </Card>
  );
};
export default ToDoCard;