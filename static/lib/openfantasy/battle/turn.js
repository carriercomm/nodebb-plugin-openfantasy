"use strict";

/*global define*/

define('rpg/battle/turn', ['translator', 'rpg/battle/ui'], function(translator, ui) {
	var turn = {},
		eventsEl,

		messageDuration = 1500;

	///*initiative, challengerDamage, opponentDamage, or eventArray?*/
	turn.go = function(result) {
		var events = result.events;

		eventsEl = $('#events')
			.removeClass('in');

		$('input, button, select').prop('disabled', true);

		for (var i = 0, ii = events.length; i < ii; i++) {
			renderEvent(i, result);
		}

		setTimeout(function() {
			if (result.finished !== 1) {
				endTurn();
			} else {
				endBattle();
			}
		}, (events.length - 1) * messageDuration);
	};

	function renderEvent(i, result) {
		setTimeout(function() {
			eventsEl.removeClass('in');
			setTimeout(function() {
				translator.translate(result.events[i].message, function(message) {
					eventsEl.html(message);
					eventsEl.addClass('in');

					switch (result.events[i].type) {
					case 'opponent:attack':
						animateOpponentAttack();
						break;
					case 'character:attack':
						updateVitals(result.data);
						break;
					}
				});
			}, 250);
		}, messageDuration * i);
	}

	function animateOpponentAttack() {
		$('#opponent_img').attr('src', $('#opponent_img').attr('src') + '?t=' + (new Date()).getTime());
	}

	function updateVitals(data) {
		$('#opponent_hp').css('width', data.battle_opponent_hp / data.battle_opponent_hp_max * 100 + '%');

		if (parseInt(data.battle_opponent_hp, 10) === 0) {
			setTimeout(function() {
				$('#opponent_img').addClass('animated rotateOut');
			}, 500);
		}
	}

	function endTurn() {
		$('input, button, select').prop('disabled', false);
		ui.toggleEligibleActions();

		var loadingBtn = $('.btn[prevHtml]');
		loadingBtn.html(loadingBtn.attr('prevHtml')).removeAttr('prevHtml');
	}

	function endBattle() {
		var parents = $('input, button, select').parents('tr');
		parents.fadeOut(400, function() {
			parents.hide();
			$('.btn-restart').parents('tr').removeClass('hide');
		});
	}

	return turn;
});