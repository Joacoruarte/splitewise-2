interface Httprequest {
  client_ip: string;
  user_agent: string;
}

interface Eventattributes {
  http_request: Httprequest;
}

type Privatemetadata = Record<string, unknown>;

interface Verification {
  status: string;
  strategy: string;
}

interface Emailaddress {
  email_address: string;
  id: string;
  linked_to: unknown[];
  object: string;
  verification: Verification;
}

interface Data {
  birthday: string;
  created_at: number;
  email_addresses: Emailaddress[];
  external_accounts: unknown[];
  external_id: string;
  first_name: string;
  gender: string;
  id: string;
  image_url: string;
  last_name: string;
  last_sign_in_at: number;
  object: string;
  password_enabled: boolean;
  phone_numbers: unknown[];
  primary_email_address_id: string;
  primary_phone_number_id: null;
  primary_web3_wallet_id: null;
  private_metadata: Privatemetadata;
  profile_image_url: string;
  public_metadata: Privatemetadata;
  two_factor_enabled: boolean;
  unsafe_metadata: Privatemetadata;
  updated_at: number;
  username: null;
  web3_wallets: unknown[];
}

export interface CreateUserWebhookBody {
  data: Data;
  event_attributes: Eventattributes;
  object: string;
  timestamp: number;
  type: string;
}
