import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ContactUsPage() {
  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-3xl">Contact Us</CardTitle>
                <CardDescription>We'd love to hear from you. Here's how you can reach us.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
                <div>
                    <h3 className="font-semibold">Official Contact Email</h3>
                    <p className="text-primary">admin@japagenie.com</p>
                </div>
                <p className="text-sm text-muted-foreground pt-4">
                    Our team will get back to you within 24-48 business hours.
                </p>
            </CardContent>
        </Card>
    </div>
  )
}
