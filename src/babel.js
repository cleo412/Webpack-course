// ф-ция для проверки работы пресета babel-preset-env 
async function start() {
	return await Promise.resolve('async is working')
}

start().then(console.log)

// const unused = 42; // эта переменная не используется и у меня для проверки работы eslint-webpack-plugin должна появляться ошибка ,  т е данный плагин срабатывает и ругается на ошибку

// класс для проверки работы плагина
class Util {
	static id = Date.now()
}

console.log('Util id:', Util.id)