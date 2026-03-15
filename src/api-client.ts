const DEFAULT_BASE_URL = 'https://api.gusto-demo.com';
const API_VERSION = '2025-11-15';

export class GustoClient {
  private accessToken: string;
  private baseUrl: string;

  constructor(accessToken: string, baseUrl?: string) {
    this.accessToken = accessToken;
    this.baseUrl = (baseUrl || DEFAULT_BASE_URL).replace(/\/$/, '');
  }

  private async request<T>(
    path: string,
    options: {
      method?: string;
      body?: any;
      params?: Record<string, string | number | boolean | undefined>;
    } = {}
  ): Promise<T> {
    const { method = 'GET', body, params } = options;
    const url = new URL(`${this.baseUrl}${path}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Accept': 'application/json',
      'X-Gusto-API-Version': API_VERSION,
    };

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (response.status === 204) return {} as T;

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API Error ${response.status}: ${text}`);
    }

    return response.json();
  }

  // --- Introspection ---

  async getTokenInfo() {
    return this.request<any>('/v1/token_info');
  }

  // --- Companies ---

  async getCompany(companyId: string) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}`);
  }

  async listCompanyAdmins(companyId: string) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}/admins`);
  }

  async getCompanyCustomFields(companyId: string) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}/custom_fields`);
  }

  // --- Locations ---

  async listLocations(companyId: string, params?: { page?: number; per?: number }) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}/locations`, { params });
  }

  async getLocation(locationId: string) {
    return this.request<any>(`/v1/locations/${encodeURIComponent(locationId)}`);
  }

  async createLocation(companyId: string, data: any) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}/locations`, {
      method: 'POST',
      body: data,
    });
  }

  // --- Pay Schedules ---

  async listPaySchedules(companyId: string) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}/pay_schedules`);
  }

  async getPaySchedule(companyId: string, payScheduleId: string) {
    return this.request<any>(
      `/v1/companies/${encodeURIComponent(companyId)}/pay_schedules/${encodeURIComponent(payScheduleId)}`
    );
  }

  async listPayPeriods(companyId: string, params?: { start_date?: string; end_date?: string }) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}/pay_periods`, { params });
  }

  // --- Earning Types ---

  async listEarningTypes(companyId: string) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}/earning_types`);
  }

  async createEarningType(companyId: string, data: any) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}/earning_types`, {
      method: 'POST',
      body: data,
    });
  }

  // --- Payrolls ---

  async listPayrolls(companyId: string, params?: {
    processing_statuses?: string;
    payroll_types?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    per?: number;
  }) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}/payrolls`, { params });
  }

  async getPayroll(companyId: string, payrollId: string) {
    return this.request<any>(
      `/v1/companies/${encodeURIComponent(companyId)}/payrolls/${encodeURIComponent(payrollId)}`
    );
  }

  async updatePayroll(companyId: string, data: any) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}/payrolls`, {
      method: 'PUT',
      body: data,
    });
  }

  // --- Company Benefits ---

  async listCompanyBenefits(companyId: string, params?: { page?: number; per?: number }) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}/company_benefits`, { params });
  }

  async getCompanyBenefit(companyBenefitId: string) {
    return this.request<any>(`/v1/company_benefits/${encodeURIComponent(companyBenefitId)}`);
  }

  async createCompanyBenefit(companyId: string, data: any) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}/company_benefits`, {
      method: 'POST',
      body: data,
    });
  }

  async listSupportedBenefits() {
    return this.request<any>('/v1/benefits');
  }

  async getBenefitSummary(companyBenefitId: string) {
    return this.request<any>(`/v1/benefits/${encodeURIComponent(companyBenefitId)}/summary`);
  }

  // --- Employees ---

  async listEmployees(companyId: string, params?: {
    page?: number;
    per?: number;
    terminated?: boolean;
  }) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}/employees`, { params });
  }

  async getEmployee(employeeId: string) {
    return this.request<any>(`/v1/employees/${encodeURIComponent(employeeId)}`);
  }

  async createEmployee(data: any) {
    return this.request<any>('/v1/employees', { method: 'POST', body: data });
  }

  async updateEmployee(employeeId: string, data: any) {
    return this.request<any>(`/v1/employees/${encodeURIComponent(employeeId)}`, {
      method: 'PUT',
      body: data,
    });
  }

  async getEmployeeCustomFields(employeeId: string) {
    return this.request<any>(`/v1/employees/${encodeURIComponent(employeeId)}/custom_fields`);
  }

  // --- Jobs & Compensations ---

  async listEmployeeJobs(employeeId: string, params?: { page?: number; per?: number }) {
    return this.request<any>(`/v1/employees/${encodeURIComponent(employeeId)}/jobs`, { params });
  }

  async getJob(jobId: string) {
    return this.request<any>(`/v1/jobs/${encodeURIComponent(jobId)}`);
  }

  async listCompensations(jobId: string) {
    return this.request<any>(`/v1/jobs/${encodeURIComponent(jobId)}/compensations`);
  }

  // --- Employee Benefits ---

  async listEmployeeBenefits(employeeId: string, params?: { page?: number; per?: number }) {
    return this.request<any>(`/v1/employees/${encodeURIComponent(employeeId)}/employee_benefits`, { params });
  }

  async getEmployeeBenefit(employeeBenefitId: string) {
    return this.request<any>(`/v1/employee_benefits/${encodeURIComponent(employeeBenefitId)}`);
  }

  async createEmployeeBenefit(employeeId: string, data: any) {
    return this.request<any>(`/v1/employees/${encodeURIComponent(employeeId)}/employee_benefits`, {
      method: 'POST',
      body: data,
    });
  }

  // --- Garnishments ---

  async listGarnishments(employeeId: string, params?: { page?: number; per?: number }) {
    return this.request<any>(`/v1/employees/${encodeURIComponent(employeeId)}/garnishments`, { params });
  }

  async getGarnishment(garnishmentId: string) {
    return this.request<any>(`/v1/garnishments/${encodeURIComponent(garnishmentId)}`);
  }

  // --- Contractors ---

  async listContractors(companyId: string, params?: { page?: number; per?: number }) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}/contractors`, { params });
  }

  async getContractor(contractorId: string) {
    return this.request<any>(`/v1/contractors/${encodeURIComponent(contractorId)}`);
  }

  async createContractor(companyId: string, data: any) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}/contractors`, {
      method: 'POST',
      body: data,
    });
  }

  async listContractorPayments(companyId: string, params?: {
    start_date?: string;
    end_date?: string;
    page?: number;
    per?: number;
  }) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}/contractor_payments`, { params });
  }

  async getContractorPayment(companyId: string, contractorPaymentId: string) {
    return this.request<any>(
      `/v1/companies/${encodeURIComponent(companyId)}/contractor_payments/${encodeURIComponent(contractorPaymentId)}`
    );
  }

  // --- Time Tracking ---

  async listTimeSheets(companyId: string, params?: {
    page?: number;
    per?: number;
    start_date?: string;
    end_date?: string;
  }) {
    return this.request<any>(`/companies/${encodeURIComponent(companyId)}/time_tracking/time_sheets`, { params });
  }

  async getTimeSheet(timeSheetId: string) {
    return this.request<any>(`/time_tracking/time_sheets/${encodeURIComponent(timeSheetId)}`);
  }

  async createTimeSheet(companyId: string, data: any) {
    return this.request<any>(`/companies/${encodeURIComponent(companyId)}/time_tracking/time_sheets`, {
      method: 'POST',
      body: data,
    });
  }

  // --- Departments ---

  async listDepartments(companyId: string) {
    return this.request<any>(`/v1/companies/${encodeURIComponent(companyId)}/departments`);
  }

  async getDepartment(departmentId: string) {
    return this.request<any>(`/v1/departments/${encodeURIComponent(departmentId)}`);
  }

  // --- Employee Addresses ---

  async listHomeAddresses(employeeId: string) {
    return this.request<any>(`/v1/employees/${encodeURIComponent(employeeId)}/home_addresses`);
  }

  async listWorkAddresses(employeeId: string) {
    return this.request<any>(`/v1/employees/${encodeURIComponent(employeeId)}/work_addresses`);
  }

  // --- Employment History ---

  async listTerminations(employeeId: string) {
    return this.request<any>(`/v1/employees/${encodeURIComponent(employeeId)}/terminations`);
  }

  async getEmploymentHistory(employeeId: string) {
    return this.request<any>(`/v1/employees/${encodeURIComponent(employeeId)}/employment_history`);
  }

  // --- Reports ---

  async createGeneralLedgerReport(payrollId: string) {
    return this.request<any>(`/payrolls/${encodeURIComponent(payrollId)}/reports/general_ledger`, {
      method: 'POST',
    });
  }

  async getReport(requestId: string) {
    return this.request<any>(`/reports/${encodeURIComponent(requestId)}`);
  }

  // --- Reimbursements ---

  async listReimbursements(employeeId: string, params?: { page?: number; per?: number }) {
    return this.request<any>(`/v1/employees/${encodeURIComponent(employeeId)}/recurring_reimbursements`, { params });
  }

  // --- Webhooks ---

  async listWebhooks() {
    return this.request<any>('/v1/webhook-subscriptions');
  }

  async getWebhook(webhookId: string) {
    return this.request<any>(`/v1/webhook-subscription/${encodeURIComponent(webhookId)}`);
  }

  // --- Events ---

  async listEvents(params?: {
    starting_after_uuid?: string;
    limit?: number;
    event_type?: string;
  }) {
    return this.request<any>('/events', { params });
  }
}
