;+
; :Description:
;   Returns file base names that we skip
;
;   Some of these are common across different help groups/modules
;
; :Returns: OrderedHash<any>
;
;-
function getSkipTheseBases
  compile_opt idl2, hidden

  skipTheseBases = orderedhash()
  skipTheseBases['ContactUs.htm'] = !true
  skipTheseBases['Preferences.htm'] = !true
  skipTheseBases['LegalAndCopyrightNotices.htm'] = !true
  skipTheseBases['WhatsNew.htm'] = !true
  skipTheseBases['WhatsNewList.htm'] = !true
  skipTheseBases['EventHandling.htm'] = !true
  skipTheseBases['SampleIDLObject.htm'] = !true
  skipTheseBases['Projects.htm'] = !true
  skipTheseBases['ErrorHandling.htm'] = !true
  skipTheseBases['CommandLineInputOutput.htm'] = !true
  skipTheseBases['ParameterClasses.htm'] = !true
  skipTheseBases['Parameters.htm'] = !true
  skipTheseBases['PlatformSupportTable.htm'] = !true
  skipTheseBases['PlatformSupportTable.htm'] = !true
  skipTheseBases['ProgrammingRoutinesTasks.htm'] = !true
  skipTheseBases['Introduction.htm'] = !true
  skipTheseBases['Tutorials.htm'] = !true
  skipTheseBases['SystemRequirements.htm'] = !true
  skipTheseBases['Obsolete.htm'] = !true
  skipTheseBases['00_Section_Content.htm'] = !true

  return, skipTheseBases
end
