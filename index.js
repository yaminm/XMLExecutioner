var fs = require('fs');
var parser = require('xml2json');


/**
 * 
 * 
 * 
 * Args that should come from the app as arguments and should get
 * 
 * 
 *  */
const PATH_TO_ARRAY = 'Profile.userPermissions';
const SEARCH_PATH_IN_ARRAY = 'name';
const SEARCH_TERM = 'ContentAdministrator'

///

const FILE_NAME = 'data/profileExample.xml';
const OUTPUT_XML_FILE_NAME = "data/edited-test.xml"


/**
 * Const
 */
const PROFILE = 'Profile';
const PERMISSION_SET = 'PermissionSet';

/**
 * 
 * 
 * App Start
 * 
 **/
const xmlIn = fs.readFileSync(FILE_NAME);
var json = JSON.parse(parser.toJson(xmlIn, {reversible: true}));
//console.dir(json);

//which xml file is it
// Not sure yet if we want to split it by type of xml files since 
if(json.hasOwnProperty(PROFILE))
{
    profileManipulations(json)
}
else if(json.hasOwnProperty(PERMISSION_SET))
{
    permissionSetManipulations(json);
}
//......



convertToXMLandSave(json,OUTPUT_XML_FILE_NAME)
/**
 * 
 * 
 * App End
 * 
 **/
function profileManipulations(json) {
    //json[Profile]
    partJson=splitPath(json,PATH_TO_ARRAY);
    console.log('partJson.length:' + partJson.length);
    for(let i=0;  i <partJson.length ;i++)
    {
        let value = splitPath(partJson[i],SEARCH_PATH_IN_ARRAY+'.$t');//.$t - added by the xml2json package to every attribute with a value
        if(value == SEARCH_TERM)
        {
            console.log('remove field ' + value);
            partJson.splice(i, 1)
            break;
        }
    }
} 

function permissionSetManipulations(json)
{
    //TO-DO 
}


function convertToXMLandSave(json,nameOfXMLFile)
{
    // our json back to xml.
    var xml = parser.toXml(json);
    // write to the disc
    fs.writeFile(nameOfXMLFile, xml, function(err, data) {
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
