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
                    <h3 className="font-semibold">General Support & Inquiries</h3>
                    <p className="text-primary">support@japagenie.com</p>
                </div>
                <div>
                    <h3 className="font-semibold">Partnerships</h3>
                    <p className="text-primary">partners@japagenie.com</p>
                </div>
                <div>
                    <h3 className="font-semibold">Press & Media</h3>
                    <p className="text-primary">media@japagenie.com</p>
                </div>
                <p className="text-sm text-muted-foreground pt-4">
                    Our team will get back to you within 24-48 business hours.
                </p>
            </CardContent>
        </Card>
    </div>
  )
}
