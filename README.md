# REACT GOOGLE FORMS
Goal: Create a simple method to publish form submissions to a Google form.

## Challenge - File Uploads
Files in Google forms are very simple when using the Google forms UI. However, there is almost no way to support the outside of the Google UI.

## Solution
This solution uses the Google Apps Scripts to create a simple API to publish the form submissions. The API is then used by the React app to publish the form submissions.

> Note: The Google Apps Script does not form part of this repo. It is very simple and I have included the code below.

Files need to be first uploaded to Google Drive. The file ID is then used in the form submission. The uploaded file must be shared with the account that is running the Google Apps Script.

> TIP: Share a folder with the Service Account. This makes this process much easier, as by default the files are stored in the root of the Service Account's Google Drive; and you will not be able to see them in the Apps Script, without sharing them.

## How to use
This is a high level overview of how to use this repo; you will need to make changes to support the form you are using, because the form fields are hard coded.

- Create a Google Form
- Create a Google Apps Script
- Add the code below to the Google Apps Script
- Deploy the Google Apps Script
  - The script must be deployed as a Web App
  - The script must execute as you
  - The script must be accessible to anyone
- Create a Project in the Google Cloud Platform
  - Enable the Google Drive API
  - Enable the Google Apps Script API
  - Create a Service Account
  - Download the Service Account JSON
  - Add yourself as a `Test user` under the OAuth consent screen
- Share a Google Drive folder with the Service Account
- Create an `.env` and add the following:

```
GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID=<Web App Deployment ID>
GOOGLE_CLIENT_EMAIL=<Service Account Email>
GOOGLE_DRIVE_FOLDER_ID=<Google Drive Folder ID>
GOOGLE_PRIVATE_KEY=<Service Account Private Key>
```

> TIP: To get the Google Drive Folder ID, open the folder in Google Drive and copy the ID from the URL. https://drive.google.com/drive/folders/FOLDER_ID

## Google Apps Script
```javascript
function doPost(e) {
  try {    
    var form = FormApp.openById('<Google Form ID>');
    var formResponse = form.createResponse();
    var items = form.getItems();
    
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var itemType = item.getType();
      var itemName = item.getTitle();
      var response = e.parameter[itemName];

      if (!response) continue;

      switch (itemType) {
        case FormApp.ItemType.TEXT:
        // This is a hack to support files, without using the FILE_UPLOAD item in the form.
          if (itemName === 'File') {
            var file = DriveApp.getFileById(response);
            response = file.getUrl();
          }
          var textResponse = item.asTextItem().createResponse(response);
          formResponse.withItemResponse(textResponse);
          break;

        case FormApp.ItemType.PARAGRAPH_TEXT:
          var paragraphResponse = item.asParagraphTextItem().createResponse(response);
          formResponse.withItemResponse(paragraphResponse);
          break;

        case FormApp.ItemType.MULTIPLE_CHOICE:
          var mcResponse = item.asMultipleChoiceItem().createResponse(response);
          formResponse.withItemResponse(mcResponse);
          break;

        case FormApp.ItemType.CHECKBOX:
          var checkboxResponses = response.split(',');
          var checkboxResponse = item.asCheckboxItem().createResponse(checkboxResponses);
          formResponse.withItemResponse(checkboxResponse);
          break;

        // Add cases for other item types if needed

        default:
          Logger.log("Unhandled item type: " + itemType);
      }
    }

    formResponse.submit();
    return ContentService.createTextOutput("Submitted!")
  } catch (err) {
    return ContentService.createTextOutput(err)
  }
}
```

## Improvements/ Ideas
- Strongly type the form fields with the Google Form fields
- Make use of the Google Apps Script API to run the script so that the script does not need to be deployed as a Web App
- Make use of the Google Forms API to create the form responses instead of the Google Apps Script
- Support files larger than 4MB