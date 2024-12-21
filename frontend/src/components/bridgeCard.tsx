import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BridgeCard({
  cardTitile,
  cardContent,
}: {
  cardTitile: String;
  cardContent: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitile}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{cardContent}</p>
      </CardContent>
    </Card>
  );
}
