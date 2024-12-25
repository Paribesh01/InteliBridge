import { BridgeCard } from "./bridgeCard";

export function NewBridgeForm() {
  return (
    <>
      <div>
        <BridgeCard cardTitile={"Trigger"} cardContent={"new email"} />
        <BridgeCard
          cardTitile={"Workflow"}
          cardContent={"send message in the discord"}
        />
      </div>
    </>
  );
}
