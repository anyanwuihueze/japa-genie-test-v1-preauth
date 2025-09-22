
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, FileText, Send, Clock, Plane } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const progressSteps = [
  {
    icon: FileText,
    title: 'Step 1: Document Gathering',
    description: 'Collect all necessary documents, such as your passport, photos, financial statements, and letters of invitation or employment.',
    status: 'completed',
  },
  {
    icon: CheckCircle,
    title: 'Step 2: Application Completion',
    description: 'Fill out the visa application form accurately. Double-check all information before submission. Use our Document Checker for AI-powered verification.',
    status: 'completed',
  },
  {
    icon: Send,
    title: 'Step 3: Submission',
    description: 'Submit your application and supporting documents to the embassy or consulate. This can often be done online or at a visa application center.',
    status: 'active',
  },
  {
    icon: Clock,
    title: 'Step 4: Waiting for Decision',
    description: 'The embassy/consulate will process your application. Processing times vary by visa type and country. You can track your status online.',
    status: 'pending',
  },
  {
    icon: Plane,
    title: 'Step 5: Visa Approval & Travel',
    description: 'Once approved, you will receive your visa. You can now make your travel arrangements.',
    status: 'pending',
  },
];

const statusStyles = {
    completed: 'border-green-500/50 bg-green-500/10',
    active: 'border-primary/50 bg-primary/10',
    pending: 'border-border bg-card'
}
const iconStyles = {
    completed: 'text-green-500',
    active: 'text-primary',
    pending: 'text-muted-foreground'
}

const statusBadges = {
    completed: 'Completed',
    active: 'In Progress',
    pending: 'Not Started'
}

const statusBadgeVariants = {
    completed: 'default',
    active: 'secondary',
    pending: 'outline'
}

export default function ProgressPage() {
  const completedSteps = progressSteps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / progressSteps.length) * 100;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Visa Application Journey</h1>
        <p className="text-lg text-muted-foreground">
          Follow these steps to navigate your visa application process successfully.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-xl">Your Progress</CardTitle>
            <p className="text-lg font-bold text-primary">{Math.round(progressPercentage)}% Complete</p>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </CardHeader>
      </Card>


      <div className="relative space-y-8">
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border -z-10 md:left-8"></div>
        {progressSteps.map((step, index) => (
          <div key={index} className="flex items-start gap-4 md:gap-8">
            <div className={`flex items-center justify-center rounded-full size-12 shrink-0 ${statusStyles[step.status as keyof typeof statusStyles]}`}>
                <step.icon className={`w-6 h-6 ${iconStyles[step.status as keyof typeof iconStyles]}`} />
            </div>
            <Card className={`flex-1 ${statusStyles[step.status as keyof typeof statusStyles]}`}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <CardTitle>{step.title}</CardTitle>
                    <Badge variant={statusBadgeVariants[step.status as keyof typeof statusBadgeVariants] as "default" | "secondary" | "outline"} className="mt-2 sm:mt-0 max-w-fit">
                        {statusBadges[step.status as keyof typeof statusBadges]}
                    </Badge>
                </div>
                <CardDescription className="pt-2">{step.description}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
