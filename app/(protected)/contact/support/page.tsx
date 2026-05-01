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
      <a 
        href="mailto:support@fasturl.com" 
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        Email us at support@fasturl.com
      </a>

      <h2 className="text-xl font-semibold mt-6 mb-2">Social Media</h2>
      <p className="text-muted-foreground mb-4">
        You can also reach out to us on our X for quick updates and news.
      </p>
    </div>
  );
}
