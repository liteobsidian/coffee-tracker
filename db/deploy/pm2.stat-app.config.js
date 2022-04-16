module.exports = {
  apps : [
    {
      name: 'stat-app',
      cwd: '/opt/stat-app/',
      script: './stat-app.bundle.js',
      watch: false,
      error_file: '/var/log/stat-app/stat-app_err.log',
      out_file: '/var/log/stat-app/stat-app.log',
      merge_logs: true,
      time: true,
      instances: 3,
      max_memory_restart: '4G',
      exec_mode: 'cluster',
      args: [],
      node_args: [
         "--max_old_space_size=4096"
      ],
      env: {
	'PORT': 3344,
        'DBHOST': '127.0.0.1',
        'DBNAME': 'stat',
        'DBPORT': 5432,
        'DBUSER': 'stat',
        'DBPASS': 'stat',
        'PATH_UPLOADS': '/opt/stat-app_uploads/',
        'REPORT_URL': '127.0.0.1:14000',
        'REPORT_API': '/api/v1/template'
      }
    },
    {
      name: 'node-excel-report',
      cwd: '/opt/node-report/',
      script: './node-report.bundle.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      error_file: '/var/log/stat-app/node-report_err.log',
      out_file: '/var/log/stat-app/node-report.log',
      time: true,
      env: {
        "NODE_ENV": "production",
        "GOTENBERG_URL": "http://localhost:17000"
      }
    },
    {
      name: 'gotenberg',
      cwd: '/opt/gotenberg/',
      script: './gotenberg.sh',
      instances: 1,
      watch: false,
      error_file: '/var/log/stat-app/gotenberg_err.log',
      out_file: '/var/log/stat-app/gotenberg.log',
      env: {
        'DEFAULT_LISTEN_PORT': 17000
      }
    }
  ],
  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
