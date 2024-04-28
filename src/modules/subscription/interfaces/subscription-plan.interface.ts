export interface ISubscriptionPlan {
  type: string;
  plan: string;
  amount: number;
  discount?: number;
  features: string[];
}

export interface IListSubscriptionPlan {
  type: string;
  isActive?: boolean;
}

export interface IGetSubscriptionPlan {
  _id: string;
  isActive?: boolean;
}

export interface IUpdateSubscriptionPlan {
  planId: string;
  amount?: number;
  discount?: number;
  features?: string[];
  isActive?: boolean;
}
