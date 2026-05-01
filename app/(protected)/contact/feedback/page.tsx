export default function FeedbackPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Feedback & Suggestions</h1>

      <p className="text-muted-foreground mb-4">
        We value your feedback! Tell us what you like about FastURL and what we can improve.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Share Your Thoughts</h2>
      <p className="text-muted-foreground mb-4">
        Have a feature request or a suggestion? We'd love to hear it.
      </p>
      <a 
        href="mailto:feedback@fasturl.com" 
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        Send Feedback
      </a>

      <h2 className="text-xl font-semibold mt-6 mb-2">Rate Us</h2>
      <p className="text-muted-foreground mb-4">
        If you're enjoying FastURL, consider leaving us a review or rating on our platform.
      </p>
    </div>
  );
}
