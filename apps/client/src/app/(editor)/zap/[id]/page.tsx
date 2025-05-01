import { notFound } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ZapPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Zap Details</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-lg">
          Zap ID:{" "}
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">{id}</span>
        </p>
      </div>
    </div>
  );
}
