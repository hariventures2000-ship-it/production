// ═══════════════════════════════════════════════════════════════════
// HARIVENTURE DIGITAL PRODUCTION — Role & Department Types
// ═══════════════════════════════════════════════════════════════════

export enum Role {
  CLIENT = 'CLIENT',
  SUPER_ADMIN = 'SUPER_ADMIN',
  CEO = 'CEO',
  MANAGING_DIRECTOR = 'MANAGING_DIRECTOR',
  HR = 'HR',
  TEAM_LEAD = 'TEAM_LEAD',
  EMPLOYEE = 'EMPLOYEE',
}

export enum AuthType {
  CLIENT = 'CLIENT',
  INTERNAL = 'INTERNAL',
  PLATFORM = 'PLATFORM',
}

export enum EmployeeSubRole {
  DEVELOPER = 'DEVELOPER',
  TESTER = 'TESTER',
  UI_UX_DESIGNER = 'UI_UX_DESIGNER',
  DEVOPS_ENGINEER = 'DEVOPS_ENGINEER',
  BUSINESS_ANALYST = 'BUSINESS_ANALYST',
}

export enum Department {
  WEBSITE_DEVELOPMENT = 'WEBSITE_DEVELOPMENT',
  PC_BUILD = 'PC_BUILD',
  MOBILE_APP = 'MOBILE_APP',
  AI_SOLUTIONS = 'AI_SOLUTIONS',
  UI_UX_DESIGN = 'UI_UX_DESIGN',
  DIGITAL_MARKETING = 'DIGITAL_MARKETING',
  SUPPORT_MAINTENANCE = 'SUPPORT_MAINTENANCE',
}

export const DEPARTMENT_LABELS: Record<Department, string> = {
  [Department.WEBSITE_DEVELOPMENT]: 'Website Development',
  [Department.PC_BUILD]: 'PC Build',
  [Department.MOBILE_APP]: 'Mobile App Development',
  [Department.AI_SOLUTIONS]: 'AI Solutions',
  [Department.UI_UX_DESIGN]: 'UI/UX Design',
  [Department.DIGITAL_MARKETING]: 'Digital Marketing',
  [Department.SUPPORT_MAINTENANCE]: 'Support & Maintenance',
};

export const SUB_ROLE_LABELS: Record<EmployeeSubRole, string> = {
  [EmployeeSubRole.DEVELOPER]: 'Developer',
  [EmployeeSubRole.TESTER]: 'Tester',
  [EmployeeSubRole.UI_UX_DESIGNER]: 'UI/UX Designer',
  [EmployeeSubRole.DEVOPS_ENGINEER]: 'DevOps Engineer',
  [EmployeeSubRole.BUSINESS_ANALYST]: 'Business Analyst',
};

export const ROLE_LABELS: Record<Role, string> = {
  [Role.CLIENT]: 'Client',
  [Role.SUPER_ADMIN]: 'Super Admin',
  [Role.CEO]: 'CEO',
  [Role.MANAGING_DIRECTOR]: 'Managing Director',
  [Role.HR]: 'Human Resources',
  [Role.TEAM_LEAD]: 'Team Lead',
  [Role.EMPLOYEE]: 'Employee',
};

export const INTERNAL_ROLES: Role[] = [
  Role.CEO,
  Role.MANAGING_DIRECTOR,
  Role.HR,
  Role.TEAM_LEAD,
  Role.EMPLOYEE,
];

export const MANAGEMENT_ROLES: Role[] = [
  Role.CEO,
  Role.MANAGING_DIRECTOR,
];
