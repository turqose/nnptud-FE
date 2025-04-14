export function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-lg bg-gray-50 p-6">
      <div className="mb-4 text-gray-600">{icon}</div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
