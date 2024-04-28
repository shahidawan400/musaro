export interface ICreateProviderSubscription {
  userId: string;
  planId: string;
  paymentOption: string;
  transactionId: string;
}

export interface ICreateSubscription extends ICreateProviderSubscription {
  paymentType: string;
  workshopId?: string;
}
