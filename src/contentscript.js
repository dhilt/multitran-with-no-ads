var multitran_without_ads = {

  initialize: function() {
    this.extension = chrome.extension;
    this.storage = chrome.storage;

    this.options = {};
    this.isExtensionControlSet = false;

    this.timerId = null;
    this.pingDelay = 75;
  },

  getStoredOptions: function() {
    var self = this;

    if (self.options = localStorage['options'])
      self.options = JSON.parse(self.options);
    else self.options = {};

    if (self.options.isEnabled === undefined) {
      self.options.isEnabled = true;
    }
  },

  injectStyleAsync: function() {
    var self = this;

    var onModifiedDOM = function() {
      document.removeEventListener('DOMSubtreeModified', onModifiedDOM, false);

      var style = document.createElement('link');
      style.rel = 'stylesheet';
      style.type = 'text/css';
      style.href = self.extension.getURL('contentscript.css');
      (document.head || document.documentElement).appendChild(style);

      if (!self.options.isEnabled) {
        return;
      }

      style = document.createElement('style');
      style.innerHTML = 'body { display: none }';
      (document.head || document.documentElement).appendChild(style);
    };

    document.addEventListener('DOMSubtreeModified', onModifiedDOM, false);
  },

  processDOMAsync: function() {
    var self = this;

    self.timerId = setInterval(function() {

      if (!self.options.isEnabled && !self.isExtensionControlSet && document.body) {
        self.setExtensionControl();
        clearInterval(self.timerId);
        return;
      }

      var translationElement = document.getElementById('translation');

      if (translationElement) {
        clearInterval(self.timerId);
        self.processDOM(translationElement.parentNode);
        self.setExtensionControl();
        document.body.style.display = 'block';
        self.setFocusOnSearchInput();
      }

    }, self.pingDelay);
  },

  processDOM: function(tableCeilElement) {
    var tableElement = document.createElement('table');
    var tableBodyElement = document.createElement('tbody');
    var tableRowElement = document.createElement('tr');

    tableRowElement.appendChild(tableCeilElement);
    tableBodyElement.appendChild(tableRowElement);
    tableElement.appendChild(tableBodyElement);

    var child;
    while (child = document.body.firstChild) {
      document.body.removeChild(child);
    }

    document.body.appendChild(tableElement);
  },

  setFocusOnSearchInput: function() {
    var searchElement = document.getElementById('s');
    if (searchElement) {
      searchElement.focus();
    }
  },

  setExtensionControl: function() {
    var self = this;
    var extCtrlElement = document.createElement('span');
    extCtrlElement.id = 'extensionToggleElements';
    extCtrlElement.innerText = '[Turn ' + (self.options.isEnabled ? 'OFF' : 'ON') + ' no-adds extension]';
    document.body.insertBefore(extCtrlElement, document.body.firstChild);

    extCtrlElement.addEventListener('click', function() {

      self.options = {
        isEnabled: !self.options.isEnabled
      };
      chrome.storage.local.set({
        options: self.options
      });
      localStorage['options'] = JSON.stringify(self.options);

      window.location.reload();
    });

    self.isExtensionControlSet = true;
  },

  run: function() {
    this.initialize();
    this.getStoredOptions();
    this.injectStyleAsync();
    this.processDOMAsync();
  }
};


multitran_without_ads.run();