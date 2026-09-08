/*
  IDL class to handle notifications to/from IDL.
  Used by WIDGET_BROWSER.

  Note: This code only needs to run in the Chromium browser, so we don't
  have to worry about cross-browser differences with CustomEvent.

  Examples:
  1. Send a notification from JavaScript to IDL:
     IDL.notifyIDL("my message payload");

  2. Register to receive notifications from IDL:
     IDL.addEventListener(myIDLListener);
     var myIDLListener = function(event)
     {
       var idlValue = JSON.parse(event.detail);
       ...
     };
*/
if (typeof IDL === 'undefined') {
  var IDL = {
    /*
      Send a notification from JavaScript to IDL.
      value: A string containing the message payload.

      Usage:
        IDL.notifyIDL("my message payload");
    */
    notifyIDL: function (value) {
      window.cefQuery({
        request: value,
        persistent: false,
        onSuccess: function (response) {
          // Do nothing
        },
        onFailure: function (error_code, error_message) {
          console.log(error_message);
        },
      });
    },

    /*
      Receive a notification from IDL and route to the listeners.
      This is called from the IDL C code; the user should never need
      to use this method directly.
    */
    notifyJS: function (value) {
      var event = new CustomEvent('IDLNotify', { detail: value });
      document.dispatchEvent(event);
    },

    /*
      Register a listener to receive notifications from IDL.

      listener: an object to receive the event notification.
         This should either be an object implementing the
         EventListener interface, or a JavaScript function.
         The event.detail will contain the IDL message payload.

      Usage:
         IDL.addEventListener(myIDLListener);
    */
    addEventListener: function (listener) {
      document.addEventListener('IDLNotify', listener);
    },
  };
}
