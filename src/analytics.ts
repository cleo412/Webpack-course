import * as $ from 'jquery';

function createAnalytics(): object{
	let counter = 0;
	let isDestroyed: boolean = false; 

	// увеличение counter
	const listener = () : number => counter++;

	$(document).on('click', listener);


	return {
		destroy() { // если я вызываю destroy, то аналитика прекращает свое действие

			$(document).off('click', listener);
			isDestroyed = true;
		},

		getClicks() {// подсчет кликов на странице

			if (isDestroyed) { 
				return 'Analytics is destroyed. total: 200000';
			}

			return counter; // кол-во кликов по странице
		}
	}
}

window['analytics'] = createAnalytics(); // чтобы сразу воспользоваться аналитикой я  ГЛОБАЛЬНОЙ переменной window в объект analytics присвою значение ф-ции createAnalytics

/* проверить работу первого метода getClicks ф-ции createAnalytics можно прописав в консоли analytics.destroy()и таким образом уничтожить аналитику) и потом прописать в консоли analytics.getClicks()и получить в консоли фразу 'Analytics is destroyed'

проверить работу второго метода getClicks ф-ции createAnalytics можно прописав в консоли analytics.getClicks(), предварительно пощелкав в поле документе в браузере несколько раз, для проверки
*/






