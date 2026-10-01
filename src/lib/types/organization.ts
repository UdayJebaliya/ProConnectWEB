export interface Organization {
  id: number;
  name: string;
  status: boolean;
  isConnectedWithTool: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationRequest {
  name: string;
  status?: boolean;
}

export interface UpdateOrganizationRequest {
  name: string;
  status: boolean;
}
