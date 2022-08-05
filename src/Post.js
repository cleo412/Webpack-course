module.exports = class Post {
	constructor(title, img) {
		this.title = title,
			this.img = img
		this.date = new Date()
	}

	toString() {
		return JSON.stringify({ //  позволяет превращать в строку различные объекты	
			title: this.title, // оборачиваем объект, у которого есть поле title 		
			date: this.date.toJSON(),
			img: this.img
		}, null, 2)
	}
	get upperCaseTitle() {
		return this.title.toUpperCase(); // проверю, что в папке dist в файле index.html изменятся файлы main и analytics из-за того, что в меняется контент файла
	}
}
