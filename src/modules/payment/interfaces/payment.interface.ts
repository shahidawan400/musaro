export interface IListPaymentsQueryParams {
  id?: string;
  source?: string;
  status?: string;
  card_last_digits?: string;
  created?: {
    gt?: string;
    lt?: string;
  };
  metadata?: {
    YOUR_KEY?: string;
  };
  updated?: {
    gt?: string;
    lt?: string;
  };
  receipt_no?: string;
  authorize_id?: string;
}
