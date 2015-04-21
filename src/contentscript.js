var multitran_without_ads = {

	timerId: null,

	injectStyleAsync: function () {
		var onModifiedDOM = function () {
			document.removeEventListener('DOMSubtreeModified', onModifiedDOM, false);

			var style = document.createElement("style");
			style.innerHTML = "body {display: none;}";
			(document.head || document.documentElement).appendChild(style);

		};

		document.addEventListener('DOMSubtreeModified', onModifiedDOM, false);
	},

	processDOMAsync: function() {
		var self = this;

		self.timerId = setInterval(function () {
			var translationElement = document.getElementById('translation');

			if (translationElement) {
				clearInterval(self.timerId);
				self.processDOM(translationElement.parentNode);
				document.body.style.display = 'block';
			}
		}, 75);
	},

	processDOM: function (tableCeilElement) {
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

	run: function () {
		this.injectStyleAsync();
		this.processDOMAsync();
	}
};


multitran_without_ads.run();