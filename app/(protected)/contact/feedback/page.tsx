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
      <div className="flex gap-2 text-black">
        <p>Email us:</p>
        <p className="font-bold">fasturl@tutamail.com</p>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Rate Us</h2>
      <p className="text-muted-foreground mb-4">
        If you're enjoying FastURL, consider leaving us a review or rating on our platform.
      </p>
    </div>
  );
}
