interface AdminConfig {
  adminUsername: string;
  adminPassword: string;
  apiToken: string;
}

const adminConfig: AdminConfig = {
  adminUsername: process.env.ADMIN_USERNAME || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  apiToken: process.env.API_TOKEN || ''
};

export default adminConfig;
