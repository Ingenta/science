Package.describe({
  name: 'science-users',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use([
    "science-lib",
    "accounts-base",
    "accounts-password",
    "perak:user-roles"
  ],['server','client']);

  api.addFiles([
    'lib/server/users.js'
  ], ['server']);

  api.addFiles([
    'lib/client/views/accounts/forgot_password/forgot_password.html',
    'lib/client/views/accounts/forgot_password/forgot_password.js',
    'lib/client/views/accounts/forgot_password/forgot_password_controller.js',
    'lib/client/views/accounts/login/login.html',
    'lib/client/views/accounts/login/login.js',
    'lib/client/views/accounts/login/login_controller.js',
    'lib/client/views/accounts/logout/logout.html',
    'lib/client/views/accounts/logout/logout.js',
    'lib/client/views/accounts/logout/logout_controller.js',
    'lib/client/views/accounts/register/register.html',
    'lib/client/views/accounts/register/register.js',
    'lib/client/views/accounts/register/register_controller.js',
    'lib/client/views/accounts/reset_password/reset_password.html',
    'lib/client/views/accounts/reset_password/reset_password.js',
    'lib/client/views/accounts/reset_password/reset_password_controller.js',
    'lib/client/views/accounts/user_settings/user_settings.html',
    'lib/client/views/accounts/user_settings/user_settings.js',
    'lib/client/views/accounts/user_settings/user_settings_controller.js',
    'lib/client/views/accounts/user_settings/update_information/update_information.html',
    'lib/client/views/accounts/user_settings/update_information/update_information.js',
    'lib/client/views/accounts/user_settings/update_information/update_information_controller.js',
    'lib/client/views/accounts/user_settings/change_pass/change_pass.html',
    'lib/client/views/accounts/user_settings/change_pass/change_pass.js',
    'lib/client/views/accounts/user_settings/change_pass/change_pass_controller.js',
    'lib/client/views/accounts/user_settings/profile/profile.html',
    'lib/client/views/accounts/user_settings/profile/profile.js',
    'lib/client/views/accounts/user_settings/profile/profile_controller.js',
    'lib/client/views/admin/roles/choose/permissions.html',
    'lib/client/views/admin/roles/choose/permissions.js',
    'lib/client/views/admin/admin.html',
    'lib/client/views/admin/admin.js',
    'lib/client/views/admin/admin_controller.js',
    'lib/client/views/admin/roles/roles.html',
    'lib/client/views/admin/roles/roles.js',
    'lib/client/views/admin/roles/roles_controller.js',
    'lib/client/views/admin/roles/insert/insert.html',
    'lib/client/views/admin/roles/insert/insert.js',
    'lib/client/views/admin/roles/insert/insert_controller.js',
    'lib/client/views/admin/roles/edit/edit.html',
    'lib/client/views/admin/roles/edit/edit.js',
    'lib/client/views/admin/users/users.html',
    'lib/client/views/admin/users/users.js',
    'lib/client/views/admin/users/users_controller.js',
    'lib/client/views/admin/users/details/details.html',
    'lib/client/views/admin/users/details/details.js',
    'lib/client/views/admin/users/details/details_controller.js',
    'lib/client/views/admin/users/edit/edit.html',
    'lib/client/views/admin/users/edit/edit.js',
    'lib/client/views/admin/users/edit/edit_controller.js',
    'lib/client/views/admin/users/insert/insert.html',
    'lib/client/views/admin/users/insert/insert.js',
    'lib/client/views/admin/users/insert/insert_controller.js',
    'lib/client/views/sidebar.html',
    'lib/client/views/sidebar.js'
  ],['client']);//必须写上第二个参数，否则可能会出现  Template is not defined 因为server side是没有templating包的

  api.addFiles([
    'lib/namespace.js',
    'lib/methods.js',
    'lib/routes.js'
  ], ['client', 'server']);

  api.export('Users');

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('science-users');
  api.addFiles('science-users-tests.js');
});
