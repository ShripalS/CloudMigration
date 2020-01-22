// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  loginUrl: 'https://login.microsoftonline.com/',
  tenant: '9d49e87c-b824-4a85-b356-959486698cf3',
  client_id: '78ebb17a-0c3d-4470-a6c9-bc5f4338c6c3',
  client_secret: 'Hb-06.VL8?:pqN7L@?4.uNyZ]yT6jaqG',
  redirect_uri: 'https://cmsforaks.azurewebsites.net/authenticate',
  code_scope: 'offline_access%20user.read%20mail.read',
  token_scope: 'https://management.azure.com/.read',
  state: '12345',
  //extraQueryParameter: 'nux=1', // This is optional
  endpoints: {
    'management':'https://management.azure.com/' //'https://management.azure.com/':'54f42fd9-805d-48a6-b6f7-7b591bd7489a''
    // 'https://management.azure.com/subscriptions?api-version=2019-06-01' : 'https://management.azure.com/'
    //"http://localhost:4200/authenticate": 'a4c3a58f-33dc-43f2-8a00-c53bab1e68c2' // Note, this is an object, you could add several things here
  },
  cmsapiendpoint: "http://cmsapiaks.azurewebsites.net/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
