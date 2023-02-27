# Message Patterns

##  :apple: iOS
RegEx Pattern: `\[\d(?:\d|)\/\d(?:\d|)\/\d(?:\d|) \d(?:\d|):\d(?:\d|):\d(?:\d|)(?: PM| AM|)]`

> [dd/mm/yy hh:mm:ss] Person 1: message content
  [dd/mm/yy hh:mm:ss] Person 2: message content

>  [dd/mm/yy hh:mm:ss PM] Person 1: message content
  [dd/mm/yy hh:mm:ss AM] Person 2: message content


>  [(m:mm)/(d:dd)/yy hh:mm:ss] Person 1: message content
  [(m:mm)/(d:dd)/yy hh:mm:ss] Person 2: message content

>  [(m:mm)/(d:dd)/yy hh:mm:ss PM] Person 1: message content
  [(m:mm)/(d:dd)/yy hh:mm:ss AM] Person 2: message content
