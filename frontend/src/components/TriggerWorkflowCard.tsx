import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAvialableTrigger from "@/hooks/AvailableTrigger";

export function TriggerWorkflowCard() {
  const { data, error, loading } = useAvialableTrigger();

  const res = data as any;

  if (loading) {
    return (
      <Card className="w-72">
        <CardHeader>
          <CardTitle>Trigger</CardTitle>
          <CardDescription>Loading triggers...</CardDescription>
        </CardHeader>
        <CardContent>Loading...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-72">
        <CardHeader>
          <CardTitle>Trigger</CardTitle>
          <CardDescription>Error occurred</CardDescription>
        </CardHeader>
        <CardContent>{error}</CardContent>
      </Card>
    );
  }

  const triggers = res?.triggers;

  return (
    <Card className="w-72">
      <CardHeader>
        <CardTitle>Trigger</CardTitle>
        <CardDescription>Triggers are listed below</CardDescription>
      </CardHeader>
      <CardContent>
        {triggers && triggers.length > 0 ? (
          triggers.map((trigger: any, index: number) => (
            <p key={index}>{trigger.name}</p>
          ))
        ) : (
          <p>No triggers available.</p>
        )}
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
