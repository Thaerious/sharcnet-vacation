The files in this directory are used on the command line to trigger functionality without running the web server.


## Example

```
ed@Desktop-Orchid:~/trunk/vacation$ node test/manual_integration/submitNew.js
{
  email: 'frar.test@gmail.com',
  start_date: 'Tue, Nov 15, 2022',
  end_date: 'Wed, Nov 16, 2022',
  type: 'full',
  name: 'Steve McQueen',
  institution: 'guelph',
  weekday_count: 2,
  return_date: 'Thu, Nov 17, 2022',
  todays_date: 'Mon, Nov 14, 2022',
  manager_email: '<li>frar.test+manager1@gmail.com<li>frar.test+manager2@gmail.com',
  status: 'pending',
  hash: 'zjikM3kYdNmrUByO5uazjSayXHn7JBMT'
}
ed@Desktop-Orchid:~/trunk/vacation$ node test/manual_integration/acceptRequest.js zjikM3kYdNmrUByO5uazjSayXHn7JBMT
```
