## 0.3.0
* Added confirmation to email address.
* Cleared Up ambiguous date message to Manager.
* Added popup to staff to inidcate request in progress.
* Addup popup to staff to indicate request has been processed.
* Multiple manager emails.
* Update to all emails to remove ambiguous dates.
* Added weekday count to emails.
* All managers now get a confirmation email.
* Changed test emails to differentiate addresses.
* Added check to ensure multiple managers don't accept the same request.
* Improved accept/reject information screen.

## 0.3.1
* Added sharcnet logo to splash screen.
* Added exception handling to server http launcher.
* Removed Shibboleth documentation.
* Apache and Shibboleth instructions removed from readme.md.
* Submitting a new request will no longer wait for email interface to respond.
* Added text response to emails (retained html).
* Date wording clarification.

## 0.3.2 Hotfix
* Fix missing email fields.

## 0.3.3 Hotfix
* Fixed broken reject/status link.
* Added tests to help detect broken links.
* Added test for missing email interpolations.
* Added pending send checks for email interface (needed so tests don't end early).
* EMInterface now waits for emails to complete when server closes.
* Expanded unit tests.
* Server checks for 'if end_date < start_date then end_date <== start_date'.
* Weekday count is now set to 0.5 from 1.0 when partial day is selected.
* Partial days now report return day as same day.