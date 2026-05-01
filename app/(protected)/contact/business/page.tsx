export default function BusinessPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Business Inquiries</h1>

      <p className="text-muted-foreground mb-4">
        Interested in using FastURL for your business? We offer custom solutions and enterprise-grade features.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Partnerships</h2>
      <p className="text-muted-foreground mb-4">
        Explore partnership opportunities with FastURL. Let's grow together.
      </p>
      <div className="flex gap-2 text-black">
        <p>Email us:</p>
        <p className="font-bold">fasturl@tutamail.com</p>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Enterprise Solutions</h2>
      <p className="text-muted-foreground mb-4">
        For large-scale needs, we provide dedicated support, custom domains, and advanced analytics.
      </p>
    </div>
  );
}
