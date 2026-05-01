export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Contact Support</h1>

      <p className="text-muted-foreground mb-4">
        Need help with FastURL? Our support team is here to assist you with any issues or questions you may have.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Email Support</h2>
      <p className="text-muted-foreground mb-4">
        The best way to reach us is via email. We typically respond within 24 hours.
      </p>
      <div className="flex gap-2 text-black">
        <p>Email us:</p>
        <p className="font-bold">fasturl@tutamail.com</p>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Social Media</h2>
      <p className="text-muted-foreground mb-4">
        You can also reach out to us on our X for quick updates and news.
      </p>
    </div>
  );
}
