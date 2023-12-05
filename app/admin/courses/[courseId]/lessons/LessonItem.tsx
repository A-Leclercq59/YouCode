import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Lesson } from "@prisma/client";

export type LessonItemProps = {
  lesson: Lesson;
};

const LessonItem = (props: LessonItemProps) => {
  return (
    <div className="bg-card border hover:bg-accent border-boder px-4 py-2 rounded flex items-center transition-colors">
      <Typography variant="large">{props.lesson.name}</Typography>
      <Badge className="ml-auto">{props.lesson.state}</Badge>
    </div>
  );
};

export default LessonItem;
