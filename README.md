# ad-server


Supply Tag Environment
We have made Supply Tag Environments more robust. 
Appropriate macros are now automatically selected according to the selected environment. 
Examples of tags with default macros are as follows:

- Desktop: http://localhost:3000/vast/xxxxxx?w={{WIDTH}}&h={{HEIGHT}}&url={{ENCODED_URL}}&cb={{CACHEBUSTER}}
- Mobile Web: http://localhost:3000/vast/xxxxxx?w={{WIDTH}}&h={{HEIGHT}}&url={{ENCODED_URL}}&cb={{CACHEBUSTER}}&ip={{IP}}&ua={{USER_AGENT}}&lat={{LAT}}&lon={{LON}}&dnt={{DNT}}
- In-App: http://localhost:3000/vast/xxxxxx?w={{WIDTH}}&h={{HEIGHT}}&cb={{CACHEBUSTER}}&ip={{IP}}&ua={{USER_AGENT}}&lat={{LAT}}&lon={{LON}}&dnt={{DNT}}&app_bundle={{APP_BUNDLE}}&url={{APP_NAME}}&app_name={{APP_NAME}}&did={{DEVICE_ID}}
- CTV: http://localhost:3000/vast/xxxxxx?w=1920&h=1080&cb={{CACHEBUSTER}}&ip={{IP}}&ua={{USER_AGENT}}&app_bundle={{APP_BUNDLE}}&url={{APP_NAME}}&app_name={{APP_NAME}}&did={{DEVICE_ID}}


Additional Macros:
- &v={{VISIBILTY}}
- &gdpr={{GDPR}}
- &gdpr_consent={{GDPR_CONSENT}}
- &usp={{US_PRIVACY}}
- &schain={{SCHAIN}}

Note that the CTV template uses the {{APP_NAME}} macro for both the url and app_name fields. Passing the app name to the url parameter allows you to have reporting. If you export your tags in this manner, you can see app names when running a domain report. Passing the app name to the app_name parameter ensures that it is passed to your demand tags. This tag also includes hard-coding the height and width, which we have found to improve performance of CTV tags.
