var fs = require('fs');
var parser = require('xml2json');






// List of profiles and permsets files
var profileFiles = ["Care User.profile-meta.xml", "Corporate User.profile-meta.xml", "ERT User.profile-meta.xml", "Ingram Micro User.profile-meta.xml", "Insight Team.profile-meta.xml", "Knowledge Editor.profile-meta.xml", "Retail User.profile-meta.xml", "RUS User.profile-meta.xml"];


//Nodes we want to remove from profiles
var userPermissionsNames = ["ContentWorkspaces", "EditReports", "EnableCommunityAppLauncher"];
var fieldPermissionsNames = ["Case.IsSelfServiceClosed", "Case.IsVisibleInSelfService", "Case.IsVisibleInCss"];





const PROFILES_FOLDER = '../../force-app-backup/main/default/profiles/';
const PERMSETS_FOLDER = '../../force-app-backup/main/default/permissionsets/';
const DASHBOARD_FOLDER = '../../force-app-backup/main/default/dashboards/Best_Practice_Service_Dashboards/';

/**
 * Const
 */
const PROFILE = 'Profile';
const PERMISSION_SET = 'PermissionSet';

/**
 *
 * Args that should come from the app as arguments and should ge 
 * 
 *  */

///



/**
 * 
 * 
 * App Start
 * 
 **/

 //Deleting unwanted password policies and setssion settings files



 var path_profile_pass_policy = "../../force-app-backup/main/default/profilePasswordPolicies/PT1_profilePasswordPolicy1559051539083.profilePasswordPolicy-meta.xml";
 var path_profile_session_settings = "../../force-app-backup/main/default/profileSessionSettings/PT1_profileSessionSetting1559051539141.profileSessionSetting-meta.xml";
 if (fs.existsSync(path_profile_pass_policy)) {
    fs.unlinkSync(path_profile_pass_policy);
}
if (fs.existsSync(path_profile_session_settings)) {
    fs.unlinkSync(path_profile_session_settings);
}

 //Update dashboards

SEARCH_PATH_IN_ARRAY = 'field';
FILE_NAME =  DASHBOARD_FOLDER + "CIEfckFrXtKHWHmwKBByjLMvAtjSPy.dashboard-meta.xml";
    var xmlIn = fs.readFileSync(FILE_NAME);
    var json = JSON.parse(parser.toJson(xmlIn, {reversible: true}));
    delete json.Dashboard.runningUser;
    convertToXMLandSave(json,FILE_NAME);

SEARCH_PATH_IN_ARRAY = 'field';
FILE_NAME =  DASHBOARD_FOLDER + "aEfvEbjpaQeHACzqzomLBDBsBiuDlj.dashboard-meta.xml";
var xmlIn = fs.readFileSync(FILE_NAME);
var json = JSON.parse(parser.toJson(xmlIn, {reversible: true}));
delete json.Dashboard.runningUser;
convertToXMLandSave(json,FILE_NAME);



 //update fieldPermissions in permsets

PATH_TO_ARRAY = 'PermissionSet.fieldPermissions';
SEARCH_PATH_IN_ARRAY = 'field';
FILE_NAME =  PERMSETS_FOLDER+ "Object_Access_Scratch_Orgs.permissionset-meta.xml";
OUTPUT_XML_FILE_NAME = FILE_NAME;
SEARCH_TERM = "Case.IsVisibleInCss";        
executeUpdate();




//remove Account.Business_Account from Object_Access_Scratch_Orgs permission set

PATH_TO_ARRAY = 'PermissionSet.recordTypeVisibilities';
SEARCH_PATH_IN_ARRAY = 'recordType';
FILE_NAME =  PERMSETS_FOLDER+ "Object_Access_Scratch_Orgs.permissionset-meta.xml";
OUTPUT_XML_FILE_NAME = FILE_NAME;
SEARCH_TERM = "Account.Business_Account";
executeUpdate();


console.log("Updating profiles");
//update userPermissions in profiles
PATH_TO_ARRAY = 'Profile.userPermissions';
SEARCH_PATH_IN_ARRAY = 'name';
for(let i=0;  i < profileFiles.length ;i++){
    FILE_NAME =  PROFILES_FOLDER+ profileFiles[i];
    OUTPUT_XML_FILE_NAME = FILE_NAME;
    for(let j=0;  j <userPermissionsNames.length ;j++){
        SEARCH_TERM = userPermissionsNames[j];
        executeUpdate();
    }
}

//update fieldPermissions in profiles
PATH_TO_ARRAY = 'Profile.fieldPermissions';
SEARCH_PATH_IN_ARRAY = 'field';
for(let i=0;  i < profileFiles.length ;i++){
    FILE_NAME =  PROFILES_FOLDER+ profileFiles[i];
    OUTPUT_XML_FILE_NAME = FILE_NAME;
    for(let j=0;  j <fieldPermissionsNames.length ;j++){
        SEARCH_TERM = fieldPermissionsNames[j];
        executeUpdate();
    }
}






function executeUpdate(){
    var xmlIn = fs.readFileSync(FILE_NAME);
    var json = JSON.parse(parser.toJson(xmlIn, {reversible: true}));
    manipulateFile(json);
    convertToXMLandSave(json,OUTPUT_XML_FILE_NAME);
}


/**
 * 
 * 
 * App End
 * 
 **/
function manipulateFile(json) {
    partJson=splitPath(json,PATH_TO_ARRAY);
    for(let i=0;  i <partJson.length ;i++)
    {
        let value = splitPath(partJson[i],SEARCH_PATH_IN_ARRAY+'.$t');//.$t - added by the xml2json package to every attribute with a value
        if(value == SEARCH_TERM)
        {
            console.log('remove field ' + value);
            partJson.splice(i, 1);
            break;
        }
    }
} 


function convertToXMLandSave(json,nameOfXMLFile)
{
    // our json back to xml.
    var xml = parser.toXml(json);
    // write to the disc
    fs.writeFileSync(nameOfXMLFile, xml, function(err, data) {
        if (err) console.log(err);
        console.log("successfully written our update xml to file");
      });
    
} 


/** 
 * 
 * return the part of the json dynamicly by the path.
 * path should be something like this 'Profile.fieldPermissions' Profile.fieldPermissions.a.b.c.s' 
 * 
*/
function splitPath(json,path)
{
    var pathArr;
    if(path.indexOf('.') == -1)
    {
        return  json[path];
    }
    else
    {
        pathArr= path.split('.');
        var currNode =pathArr.shift();
        if(pathArr.length == 1)
            return splitPath(json[currNode],pathArr)
        else
           return splitPath(json[currNode],pathArr.join('.'))
    }

}
