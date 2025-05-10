export type ZapStatus = "active" | "inactive" | "failed";

export interface Zap {
  id: string;
  name: string;
  description?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  trigger?: Trigger | null;
  workflows: Workflow[];
}

export interface Trigger {
  id: string;
  triggerId: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  metaData?: any;
  zapId: string;
  set: boolean;
  type: AvailableTrigger;
  done: boolean;
}

export interface Workflow {
  id: string;
  workflowId: string;
  zapId: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  metaData?: any;
  index: number;
  type: AvailableWorkflow;
  done: boolean;
}

export interface AvailableTrigger {
  id: string;
  name: string;
  image: string;
  subType?: string | null;
  triggers: Trigger[];
}

export interface AvailableWorkflow {
  id: string;
  name: string;
  image: string;
  subType?: string | null;
  workflow: Workflow[];
}
