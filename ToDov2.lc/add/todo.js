function saveState() {

			var notReady = [];
			var ready = [];

			$('#list-not-ready li.task span').each(function (i, el) {
				var val = escape($(el).text());
				notReady.push(val);
			});

			$('#list-ready li.task span').each(function (i, el) {
				var val = escape($(el).text());
				ready.push(val);
			});

			var result = notReady.join('&') + '|' + ready.join('&');

			var time = new Date();
			time.setTime(time.getTime() + 2678400000);
			document.cookie = 'data=' + result + "; expires=" + time.toGMTString();
		}

		function loadState() {

			var addList = function (strList, isComplete) {

				var list = strList.split('&');

				for (var i = 0; i < list.length; i++) {
					if (list[i]) {
						addTask(unescape(list[i]), isComplete);
					}
				}
			}

			var getCookie = function (name) {
				var cSIndex = document.cookie.indexOf(name);
				if (cSIndex == -1) {
					return ''
				};

				cSIndex = document.cookie.indexOf(name + "=")
				if (cSIndex == -1) {
					return ''
				};

				var cEIndex = document.cookie.indexOf(";", cSIndex + (name + "=").length);
				if (cEIndex == -1) {
					cEIndex = document.cookie.length;
				}

				return document.cookie.substring(cSIndex + (name + "=").length, cEIndex);
			}

			var parts = getCookie('data').split('|');

			addList(parts[0], false);

			if (parts.length > 1) {
				addList(parts[1], true);
			}
		}

		function moveTask(li, isComplete) {
			var containner = isComplete ? '#list-ready' : '#list-not-ready';
			li.appendTo(containner);
			saveState();
		}

		function addTask(val, isComplete) {

			var span = $('<span />').text(val);
			var cb = $('<input type="checkbox" />');
			var del = $('<a class="del" href="#" />').text('×');
			var li = $('<li class="task" />').append(del).append(cb).append(span);

			cb.click(function () {
				moveTask(li, cb.prop('checked'));
			}).prop('checked', isComplete);

			del.click(function () {
				li.remove();
				saveState();
				return false;
			});

			moveTask(li, isComplete);
		}

		$(function () {

			$('#btn-enter').click(function () {
				var val = $('#new-todo').val();
				if (val) {
					addTask(val);
					$('#new-todo').val('');
				}
				return false;
			});

			$('#new-todo').keypress(function (e) {
				if (e.keyCode == 13) {
					$('#btn-enter').click();
				}
			});

			$('#list-not-ready').sortable({ deactivate: saveState }); // после перетаскивания сохраняем состояние в куках



			$('#btn-remove-all').click(function () {
				$('#list-ready').empty();
				$('#list-not-ready').empty();
				saveState();
				return false;
			});

			$('#btn-remove-completed').click(function () {
				$('#list-ready').empty();
				saveState();
				return false;
			});

			loadState();
		});