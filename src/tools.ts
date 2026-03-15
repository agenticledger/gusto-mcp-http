import { z } from 'zod';
import { GustoClient } from './api-client.js';

interface ToolDef {
  name: string;
  description: string;
  inputSchema: z.ZodType<any>;
  handler: (client: GustoClient, args: any) => Promise<any>;
}

export const tools: ToolDef[] = [
  // --- Introspection ---
  {
    name: 'token_info',
    description: 'Get current access token scope and info',
    inputSchema: z.object({}),
    handler: async (client) => client.getTokenInfo(),
  },

  // --- Companies ---
  {
    name: 'company_get',
    description: 'Get company details',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
    }),
    handler: async (client, args: { company_id: string }) =>
      client.getCompany(args.company_id),
  },
  {
    name: 'company_admins_list',
    description: 'List company administrators',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
    }),
    handler: async (client, args: { company_id: string }) =>
      client.listCompanyAdmins(args.company_id),
  },
  {
    name: 'company_custom_fields',
    description: 'Get company custom field definitions',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
    }),
    handler: async (client, args: { company_id: string }) =>
      client.getCompanyCustomFields(args.company_id),
  },

  // --- Locations ---
  {
    name: 'locations_list',
    description: 'List company locations',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
      page: z.number().optional().describe('page number'),
      per: z.number().optional().describe('results per page'),
    }),
    handler: async (client, args: { company_id: string; page?: number; per?: number }) =>
      client.listLocations(args.company_id, { page: args.page, per: args.per }),
  },
  {
    name: 'location_get',
    description: 'Get location details by ID',
    inputSchema: z.object({
      location_id: z.string().describe('location ID'),
    }),
    handler: async (client, args: { location_id: string }) =>
      client.getLocation(args.location_id),
  },
  {
    name: 'location_create',
    description: 'Create a new company location',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
      data: z.string().describe('location JSON'),
    }),
    handler: async (client, args: { company_id: string; data: string }) =>
      client.createLocation(args.company_id, JSON.parse(args.data)),
  },

  // --- Pay Schedules ---
  {
    name: 'pay_schedules_list',
    description: 'List company pay schedules',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
    }),
    handler: async (client, args: { company_id: string }) =>
      client.listPaySchedules(args.company_id),
  },
  {
    name: 'pay_schedule_get',
    description: 'Get pay schedule details',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
      pay_schedule_id: z.string().describe('pay schedule ID'),
    }),
    handler: async (client, args: { company_id: string; pay_schedule_id: string }) =>
      client.getPaySchedule(args.company_id, args.pay_schedule_id),
  },
  {
    name: 'pay_periods_list',
    description: 'List company pay periods',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
      start_date: z.string().optional().describe('start date YYYY-MM-DD'),
      end_date: z.string().optional().describe('end date YYYY-MM-DD'),
    }),
    handler: async (client, args: { company_id: string; start_date?: string; end_date?: string }) =>
      client.listPayPeriods(args.company_id, { start_date: args.start_date, end_date: args.end_date }),
  },

  // --- Earning Types ---
  {
    name: 'earning_types_list',
    description: 'List company earning types',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
    }),
    handler: async (client, args: { company_id: string }) =>
      client.listEarningTypes(args.company_id),
  },
  {
    name: 'earning_type_create',
    description: 'Create a custom earning type',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
      data: z.string().describe('earning type JSON'),
    }),
    handler: async (client, args: { company_id: string; data: string }) =>
      client.createEarningType(args.company_id, JSON.parse(args.data)),
  },

  // --- Payrolls ---
  {
    name: 'payrolls_list',
    description: 'List company payrolls',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
      processing_statuses: z.string().optional().describe('filter by status'),
      payroll_types: z.string().optional().describe('filter by type'),
      start_date: z.string().optional().describe('start date YYYY-MM-DD'),
      end_date: z.string().optional().describe('end date YYYY-MM-DD'),
      page: z.number().optional().describe('page number'),
      per: z.number().optional().describe('results per page'),
    }),
    handler: async (client, args: {
      company_id: string;
      processing_statuses?: string;
      payroll_types?: string;
      start_date?: string;
      end_date?: string;
      page?: number;
      per?: number;
    }) => client.listPayrolls(args.company_id, {
      processing_statuses: args.processing_statuses,
      payroll_types: args.payroll_types,
      start_date: args.start_date,
      end_date: args.end_date,
      page: args.page,
      per: args.per,
    }),
  },
  {
    name: 'payroll_get',
    description: 'Get payroll details by ID',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
      payroll_id: z.string().describe('payroll ID'),
    }),
    handler: async (client, args: { company_id: string; payroll_id: string }) =>
      client.getPayroll(args.company_id, args.payroll_id),
  },
  {
    name: 'payroll_update',
    description: 'Update a payroll',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
      data: z.string().describe('payroll update JSON'),
    }),
    handler: async (client, args: { company_id: string; data: string }) =>
      client.updatePayroll(args.company_id, JSON.parse(args.data)),
  },

  // --- Company Benefits ---
  {
    name: 'company_benefits_list',
    description: 'List company benefits',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
      page: z.number().optional().describe('page number'),
      per: z.number().optional().describe('results per page'),
    }),
    handler: async (client, args: { company_id: string; page?: number; per?: number }) =>
      client.listCompanyBenefits(args.company_id, { page: args.page, per: args.per }),
  },
  {
    name: 'company_benefit_get',
    description: 'Get company benefit details',
    inputSchema: z.object({
      company_benefit_id: z.string().describe('company benefit ID'),
    }),
    handler: async (client, args: { company_benefit_id: string }) =>
      client.getCompanyBenefit(args.company_benefit_id),
  },
  {
    name: 'company_benefit_create',
    description: 'Create a company benefit',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
      data: z.string().describe('benefit JSON'),
    }),
    handler: async (client, args: { company_id: string; data: string }) =>
      client.createCompanyBenefit(args.company_id, JSON.parse(args.data)),
  },
  {
    name: 'supported_benefits_list',
    description: 'List all Gusto-supported benefit types',
    inputSchema: z.object({}),
    handler: async (client) => client.listSupportedBenefits(),
  },
  {
    name: 'benefit_summary',
    description: 'Get benefit enrollment summary',
    inputSchema: z.object({
      company_benefit_id: z.string().describe('company benefit ID'),
    }),
    handler: async (client, args: { company_benefit_id: string }) =>
      client.getBenefitSummary(args.company_benefit_id),
  },

  // --- Employees ---
  {
    name: 'employees_list',
    description: 'List company employees',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
      page: z.number().optional().describe('page number'),
      per: z.number().optional().describe('results per page'),
      terminated: z.boolean().optional().describe('include terminated'),
    }),
    handler: async (client, args: {
      company_id: string;
      page?: number;
      per?: number;
      terminated?: boolean;
    }) => client.listEmployees(args.company_id, {
      page: args.page,
      per: args.per,
      terminated: args.terminated,
    }),
  },
  {
    name: 'employee_get',
    description: 'Get employee details by ID',
    inputSchema: z.object({
      employee_id: z.string().describe('employee ID'),
    }),
    handler: async (client, args: { employee_id: string }) =>
      client.getEmployee(args.employee_id),
  },
  {
    name: 'employee_create',
    description: 'Create a new employee',
    inputSchema: z.object({
      data: z.string().describe('employee JSON'),
    }),
    handler: async (client, args: { data: string }) =>
      client.createEmployee(JSON.parse(args.data)),
  },
  {
    name: 'employee_update',
    description: 'Update employee details',
    inputSchema: z.object({
      employee_id: z.string().describe('employee ID'),
      data: z.string().describe('update JSON'),
    }),
    handler: async (client, args: { employee_id: string; data: string }) =>
      client.updateEmployee(args.employee_id, JSON.parse(args.data)),
  },
  {
    name: 'employee_custom_fields',
    description: 'Get employee custom field values',
    inputSchema: z.object({
      employee_id: z.string().describe('employee ID'),
    }),
    handler: async (client, args: { employee_id: string }) =>
      client.getEmployeeCustomFields(args.employee_id),
  },

  // --- Jobs & Compensations ---
  {
    name: 'employee_jobs_list',
    description: 'List employee jobs',
    inputSchema: z.object({
      employee_id: z.string().describe('employee ID'),
      page: z.number().optional().describe('page number'),
      per: z.number().optional().describe('results per page'),
    }),
    handler: async (client, args: { employee_id: string; page?: number; per?: number }) =>
      client.listEmployeeJobs(args.employee_id, { page: args.page, per: args.per }),
  },
  {
    name: 'job_get',
    description: 'Get job details by ID',
    inputSchema: z.object({
      job_id: z.string().describe('job ID'),
    }),
    handler: async (client, args: { job_id: string }) =>
      client.getJob(args.job_id),
  },
  {
    name: 'compensations_list',
    description: 'List compensations for a job',
    inputSchema: z.object({
      job_id: z.string().describe('job ID'),
    }),
    handler: async (client, args: { job_id: string }) =>
      client.listCompensations(args.job_id),
  },

  // --- Employee Benefits ---
  {
    name: 'employee_benefits_list',
    description: 'List employee benefit enrollments',
    inputSchema: z.object({
      employee_id: z.string().describe('employee ID'),
      page: z.number().optional().describe('page number'),
      per: z.number().optional().describe('results per page'),
    }),
    handler: async (client, args: { employee_id: string; page?: number; per?: number }) =>
      client.listEmployeeBenefits(args.employee_id, { page: args.page, per: args.per }),
  },
  {
    name: 'employee_benefit_get',
    description: 'Get employee benefit enrollment details',
    inputSchema: z.object({
      employee_benefit_id: z.string().describe('employee benefit ID'),
    }),
    handler: async (client, args: { employee_benefit_id: string }) =>
      client.getEmployeeBenefit(args.employee_benefit_id),
  },
  {
    name: 'employee_benefit_create',
    description: 'Enroll employee in a benefit',
    inputSchema: z.object({
      employee_id: z.string().describe('employee ID'),
      data: z.string().describe('enrollment JSON'),
    }),
    handler: async (client, args: { employee_id: string; data: string }) =>
      client.createEmployeeBenefit(args.employee_id, JSON.parse(args.data)),
  },

  // --- Garnishments ---
  {
    name: 'garnishments_list',
    description: 'List employee garnishments',
    inputSchema: z.object({
      employee_id: z.string().describe('employee ID'),
      page: z.number().optional().describe('page number'),
      per: z.number().optional().describe('results per page'),
    }),
    handler: async (client, args: { employee_id: string; page?: number; per?: number }) =>
      client.listGarnishments(args.employee_id, { page: args.page, per: args.per }),
  },
  {
    name: 'garnishment_get',
    description: 'Get garnishment details by ID',
    inputSchema: z.object({
      garnishment_id: z.string().describe('garnishment ID'),
    }),
    handler: async (client, args: { garnishment_id: string }) =>
      client.getGarnishment(args.garnishment_id),
  },

  // --- Contractors ---
  {
    name: 'contractors_list',
    description: 'List company 1099 contractors',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
      page: z.number().optional().describe('page number'),
      per: z.number().optional().describe('results per page'),
    }),
    handler: async (client, args: { company_id: string; page?: number; per?: number }) =>
      client.listContractors(args.company_id, { page: args.page, per: args.per }),
  },
  {
    name: 'contractor_get',
    description: 'Get contractor details by ID',
    inputSchema: z.object({
      contractor_id: z.string().describe('contractor ID/UUID'),
    }),
    handler: async (client, args: { contractor_id: string }) =>
      client.getContractor(args.contractor_id),
  },
  {
    name: 'contractor_create',
    description: 'Create a new 1099 contractor',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
      data: z.string().describe('contractor JSON'),
    }),
    handler: async (client, args: { company_id: string; data: string }) =>
      client.createContractor(args.company_id, JSON.parse(args.data)),
  },
  {
    name: 'contractor_payments_list',
    description: 'List contractor payments',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
      start_date: z.string().optional().describe('start YYYY-MM-DD'),
      end_date: z.string().optional().describe('end YYYY-MM-DD'),
      page: z.number().optional().describe('page number'),
      per: z.number().optional().describe('results per page'),
    }),
    handler: async (client, args: {
      company_id: string;
      start_date?: string;
      end_date?: string;
      page?: number;
      per?: number;
    }) => client.listContractorPayments(args.company_id, {
      start_date: args.start_date,
      end_date: args.end_date,
      page: args.page,
      per: args.per,
    }),
  },
  {
    name: 'contractor_payment_get',
    description: 'Get contractor payment details',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
      contractor_payment_id: z.string().describe('payment ID'),
    }),
    handler: async (client, args: { company_id: string; contractor_payment_id: string }) =>
      client.getContractorPayment(args.company_id, args.contractor_payment_id),
  },

  // --- Time Tracking ---
  {
    name: 'time_sheets_list',
    description: 'List employee time sheets',
    inputSchema: z.object({
      company_id: z.string().describe('company ID/UUID'),
      start_date: z.string().optional().describe('start YYYY-MM-DD'),
      end_date: z.string().optional().describe('end YYYY-MM-DD'),
      page: z.number().optional().describe('page number'),
      per: z.number().optional().describe('results per page'),
    }),
    handler: async (client, args: {
      company_id: string;
      start_date?: string;
      end_date?: string;
      page?: number;
      per?: number;
    }) => client.listTimeSheets(args.company_id, {
      start_date: args.start_date,
      end_date: args.end_date,
      page: args.page,
      per: args.per,
    }),
  },
  {
    name: 'time_sheet_get',
    description: 'Get time sheet by ID',
    inputSchema: z.object({
      time_sheet_id: z.string().describe('time sheet UUID'),
    }),
    handler: async (client, args: { time_sheet_id: string }) =>
      client.getTimeSheet(args.time_sheet_id),
  },
  {
    name: 'time_sheet_create',
    description: 'Create a time sheet entry',
    inputSchema: z.object({
      company_id: z.string().describe('company ID/UUID'),
      data: z.string().describe('time sheet JSON'),
    }),
    handler: async (client, args: { company_id: string; data: string }) =>
      client.createTimeSheet(args.company_id, JSON.parse(args.data)),
  },

  // --- Departments ---
  {
    name: 'departments_list',
    description: 'List company departments',
    inputSchema: z.object({
      company_id: z.string().describe('company ID'),
    }),
    handler: async (client, args: { company_id: string }) =>
      client.listDepartments(args.company_id),
  },
  {
    name: 'department_get',
    description: 'Get department details by ID',
    inputSchema: z.object({
      department_id: z.string().describe('department ID'),
    }),
    handler: async (client, args: { department_id: string }) =>
      client.getDepartment(args.department_id),
  },

  // --- Employee Addresses ---
  {
    name: 'home_addresses_list',
    description: 'List employee home addresses',
    inputSchema: z.object({
      employee_id: z.string().describe('employee ID'),
    }),
    handler: async (client, args: { employee_id: string }) =>
      client.listHomeAddresses(args.employee_id),
  },
  {
    name: 'work_addresses_list',
    description: 'List employee work addresses',
    inputSchema: z.object({
      employee_id: z.string().describe('employee ID'),
    }),
    handler: async (client, args: { employee_id: string }) =>
      client.listWorkAddresses(args.employee_id),
  },

  // --- Employment History ---
  {
    name: 'terminations_list',
    description: 'List employee terminations',
    inputSchema: z.object({
      employee_id: z.string().describe('employee ID'),
    }),
    handler: async (client, args: { employee_id: string }) =>
      client.listTerminations(args.employee_id),
  },
  {
    name: 'employment_history',
    description: 'Get employee employment history',
    inputSchema: z.object({
      employee_id: z.string().describe('employee ID'),
    }),
    handler: async (client, args: { employee_id: string }) =>
      client.getEmploymentHistory(args.employee_id),
  },

  // --- Reports ---
  {
    name: 'general_ledger_report',
    description: 'Generate general ledger report for payroll',
    inputSchema: z.object({
      payroll_id: z.string().describe('payroll ID/UUID'),
    }),
    handler: async (client, args: { payroll_id: string }) =>
      client.createGeneralLedgerReport(args.payroll_id),
  },
  {
    name: 'report_get',
    description: 'Get generated report by request ID',
    inputSchema: z.object({
      request_id: z.string().describe('report request UUID'),
    }),
    handler: async (client, args: { request_id: string }) =>
      client.getReport(args.request_id),
  },

  // --- Reimbursements ---
  {
    name: 'reimbursements_list',
    description: 'List employee recurring reimbursements',
    inputSchema: z.object({
      employee_id: z.string().describe('employee ID'),
      page: z.number().optional().describe('page number'),
      per: z.number().optional().describe('results per page'),
    }),
    handler: async (client, args: { employee_id: string; page?: number; per?: number }) =>
      client.listReimbursements(args.employee_id, { page: args.page, per: args.per }),
  },

  // --- Webhooks ---
  {
    name: 'webhooks_list',
    description: 'List webhook subscriptions',
    inputSchema: z.object({}),
    handler: async (client) => client.listWebhooks(),
  },
  {
    name: 'webhook_get',
    description: 'Get webhook subscription details',
    inputSchema: z.object({
      webhook_id: z.string().describe('webhook UUID'),
    }),
    handler: async (client, args: { webhook_id: string }) =>
      client.getWebhook(args.webhook_id),
  },

  // --- Events ---
  {
    name: 'events_list',
    description: 'List company events (cursor pagination)',
    inputSchema: z.object({
      starting_after_uuid: z.string().optional().describe('cursor UUID'),
      limit: z.number().optional().describe('max results'),
      event_type: z.string().optional().describe('filter by event type'),
    }),
    handler: async (client, args: {
      starting_after_uuid?: string;
      limit?: number;
      event_type?: string;
    }) => client.listEvents({
      starting_after_uuid: args.starting_after_uuid,
      limit: args.limit,
      event_type: args.event_type,
    }),
  },
];
