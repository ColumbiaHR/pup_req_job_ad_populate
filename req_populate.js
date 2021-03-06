
javascript:
/**
 * PUP Req Job Ad Pre-Populate
 * Version pup_req_job_ad_populate-1.1
 * Populate the PUP Position Description Job Posting Wysiwyg text area from fields above in the form.
 * Note: This is a proof of concept;
 * Usage:
 ** Authenticate to your PUP account.
 ** Navigate to manage requisitions: https://admin.dc4.pageuppeople.com/v5.3/provider/manageJobs/manageJobs.asp
 ** Open a position
 ** Click the bookmarklet
 ** bask in the pre-populated text to appear in job advertisement
 * TODO: Cross Browser Support
 ** FF PC
 ** Chrome PC
 ** Edge ?
 ** DONE - FF Mac - OK as of v. new_pd_template8-bookmarklet6 2016-08-23
 ** DONE - Chrome Mac - OK as of v. new_pd_template9-bookmarklet1 2016-08-23
 ** DONE - Safari Mac - OK as of v. new_pd_template9-bookmarklet1 2016-08-23
 * DONE - add confirm when replacing exiting text. Done as of v. new_pd_template9-bookmarklet1 2016-08-23
 * DONE - Note: PUP doesn't support IE; Drop support for IE. Done.
 *
 * This code is served up remotely to ensure quality source control.
 * The local Bookmarklet src:
javascript:
void(z=document.body.appendChild(document.createElement('script')));
void(z.language='javascript');
void(z.type='text/javascript');
void(z.src='https://bitbucket.org/_vid/pup_req_job_ad_populate/raw/master/pup_req_job_ad_populate.js');
 * *** Contents ***
 * Functions
 * Object mapping, capturing values of fields on the page: 'pupPdElements'
 * Create template w/ object values inserted
 * Trigger MCE code evaluation (to format code if needed)
 */

function getMceFrame(wysiwygIframeId){
  var x = document.getElementById(wysiwygIframeId);
  var y = (x.contentWindow || x.contentDocument);
  if (y.document)y = y.document;
  return y.getElementById('tinymce');
}
function replaceText(text,wysiwygIframeId) {
  var sel;
  sel = getMceFrame(wysiwygIframeId);
  if (sel) {
    if ((sel.innerHTML.length > 30 && confirm('Are you sure you want to add to the current text in the job advertisement?')) || sel.innerHTML.length <= 30) {
      sel.innerHTML = text + sel.innerHTML;
    }
  }
}

/* ex: getTextField("lRoleID_fieldTitle"); */
function getTextField(elementID){
  return document.getElementById(elementID).value;
}

/* ex getSelectField("lDepartmentID"); */
function getSelectField(elementID){
  //return document.getElementById(elementID).options[document.getElementById(elementID).selectedIndex].text;
  var getSelected = document.getElementById(elementID).selectedIndex;
  if (getSelected > 0) {
    return document.getElementById(elementID)[getSelected].text;
  }
  else {
    return ""; 
  }
}

/* ex getTextFieldDropdown("'GenericListType_regulartemporary_chosen'"); */
function getTextFieldDropdown(elementID){
  if (document.getElementById(elementID).innerText == "Select") {
    return "";
  }
  else {
    return document.getElementById(elementID).innerText;
  }
}

/* ex getDropSearchField("GenericListType_appointment_chosen"); */
function getDropSearchField(elementID){
  result = null;
  if (typeof document.querySelectorAll('#' + elementID + ' .result-selected')[0] !== "undefined") {
    result = document.querySelectorAll('#' + elementID + ' .result-selected')[0].innerHTML;
  }
  else
    if (typeof document.querySelectorAll('#' + elementID + ' .chosen-single span')[0] !== "undefined") {
      result = document.querySelectorAll('#' + elementID + ' .chosen-single span')[0].innerHTML;
    }
  return result;
}

function getReadOnlyField(elementID){
  var divText = document.getElementById(elementID).innerHTML;
  return divText.substr(0,divText.indexOf('<')).trim();
}

function getReadOnlyFieldParent(elementID){
  var divText = document.getElementById(elementID).parentNode.innerHTML;
  return divText.substr(0,divText.indexOf('<')).trim();
}

//TODO: Somehow identify when fields are locked and choose the appropriate elementID and getText function
/*ex: chooseFunction(lAgreementTypeID, getSelectField, agreementTypeWrapper, getReadOnlyField);
function chooseFunction(elementID1,function1,elementID2,function2){
  if (document.getElementById(elementID1) !== null ) {
      return function1(elementID1);
  }
  else {
    return function2(elementID2);
  }
}*/

function getEssentialJobDuties(){
  /* for each document.querySelectorAll('#JobDutyWrapper div.jobDuty')
  if(div.jobDuty .dutyLevel == "Essential")
  div.jobDuty .dutyPercent
  div.jobDuty .dutyDuties
  */
  dutyOutput = [];
  dutyList = document.querySelectorAll('#JobDutyWrapper div.jobDuty');
  //console.log(dutyList.length);
  for(i=0;i<dutyList.length;i++){
    console.log('Pass: '+i);
    //dutyList[i].innerHTML;
    console.log("what: " + dutyList[i].querySelectorAll('.dutyLevel')[0].innerHTML);
    console.log(dutyList[i].querySelectorAll('.dutyLevel').length);
    if(dutyList[i].querySelectorAll('.dutyLevel')[0].innerHTML == "Essential"){
      dutyOutput.push( dutyList[i].querySelectorAll('.dutyPercent')[0].innerHTML + '%' + ' - ' + dutyList[i].querySelectorAll('.dutyDuties')[0].innerHTML);
    }
  }
  //console.log(dutyOutput);
  return dutyOutput.join("<br />");
}

/**
 * Object mapping, capturing values of fields on the page: 'pupPdElements'
 * Set up the data elements to populate the wysiwyg:
 */
var pupPdElements = {
  pupPdRegTemp:         getTextField('sOther3'),
  pupPdTempDuration:    getTextField('sOther6'),
  pupPdSalaryDetails:   getTextField('sOther4'),
  pupPdBargainingUnit:  getSelectField('lAgreementTypeID'),
  pupPdHours:           getTextField('sOther5'),
  pupPdSalaryDetails:   getTextField('sOther4'),
  pupPdJobType:         getTextFieldDropdown('GenericListType_regulartemporary_chosen')
};

/**
 * Create template w/ object values inserted
 * insert a clean table w/ id's. Note: this was a nice multi-line string but didn't function well as a bookmarklet
 */
newBody  = '<ul class="job-attributes">';
newBody += '<li id="pupPdJobType">Job Type: ' + pupPdElements.pupPdJobType  + '</li>';
newBody += '<li id="pupPdBargainingUnit">Bargaining Unit: ' + pupPdElements.pupPdBargainingUnit + '</li>';
newBody += '<li id="pupPdRegTemp">Regular/Temporary: ' + pupPdElements.pupPdRegTemp  + '</li>';
newBody += '<li id="pupPdTempDuration">End Date if Temporary: ' + pupPdElements.pupPdTempDuration  + '</li>';
newBody += '<li id="pupPdHours">Hours Per Week: ' + pupPdElements.pupPdHours  + '</li>';
newBody += '<li id="pupPdSalaryDetails">Salary Range: ' + pupPdElements.pupPdSalaryDetails  + '</li>';
newBody += '</ul>';
replaceText(newBody, "sOverview_ifr");

/**
 * Trigger MCE code evaluation (to format code if needed)
 * click the code button
 * locate the open modal source code div and click() the first button Ok
 */
tinyMCE.activeEditor.buttons.code.onclick();
document.querySelectorAll('[aria-label=\'Source code\'] .mce-panel button')[0].click();
