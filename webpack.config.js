const HTMLWebpackPlugin = require('html-webpack-plugin'); // для взаимодействия с html
const { resolve } = require('path');
const path = require('path'); // встроенный модуль в ноде
const CopyWebpackPlugin = require('copy-webpack-plugin'); // для фавиконки
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // в папке dist создался при сборке отдельный файл css

// const EslintWebpackPlugin = require('eslint-webpack-plugin'); //

const isDev = process.env.NODE_ENV === 'development'; // nodeJS имеет доступ до системных переменных, которые находятся в объекте process

const isProd = !isDev; // флаг в режиме true, если сборка в режиме продакшн

// console.log('IS DEV:', isDev); // чтобы в терминале увидеть isDev в режиме true или false

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");//минификация css, у Минина константа OptimizeCssAssetsWebpackPlugin, т к он устанавливал пакет для Webpack 4 - optimize-css-assets-webpack-plugin
const TerserWebpackPlugin = require("terser-webpack-plugin"); //минификация js

// по умолчанию эта функция будет экспортировать объект optimization, который находился в module.exports (ниже)
const optimization = () => {

	if (isProd) {
		return {
			// я переписываю базовый минимизаторы, которые есть в Webpack на мои оптимизаторы CssMinimizerPlugin и TerserWebpackPlugin, конфигурацию (что ниже написано) взяла тут https://webpack.js.org/plugins/css-minimizer-webpack-plugin/

			minimizer: [
				new CssMinimizerPlugin(),
				new TerserWebpackPlugin() //минификация js
			],
			minimize: true,
		};
	}
	return {};
}

module.exports = {
	context: path.resolve(__dirname, 'src'), // где будут лежать все исходники приложения. если прописать тут просто 'src' - в терминале будет ошибка, поэтому пользуюсь встроенным в  webpack модулем path

	mode: 'development', // собираю в режиме разработки, теперь файл bundle.js не будет минифицированным (в виде одной длинной строки без пробелов)

	entry: {
		main: './index.js', // не указываю src, т к прописан context, было './src/index.js', ЭТО НАЗЫВАЕТСЯ ЧАНКИ (сборник скриптов), с этого файла начнется у вебпак сборка, это точка входа, ТОЧЕК ВХОДА МОЖЕТ БЫТЬ НЕСКОЛЬКО (например, для файла analytics.js)

		analytics: './analytics.ts'  // не указываю src, т к прописан context, было './src/analytics.js', ЭТО НАЗЫВАЕТСЯ ЧАНКИ (сборник скриптов)
	},

	output: {
		filename: '[name].[contenthash].js', //тут собирается весь код, он в папке dist. [name]. - это чтобы точкой входа являлся main в entry (выше по коду). Из-за этого в папке dist появится еще один файл main.bundle.js и файл analytics.bundle.js. старый bundle.js остается, с ним разберусь позже.

		path: path.resolve(__dirname, 'dist'), //прописывается путь куда webpack все складывать. Корректнее будет, если я пропишу встроенный модуль в самом начале этого файла (const path = require('path');), ниже у модуля path вызываю метод resolve() и отталкиваясь от текущей директории (системная переменная с двумя нижними подчеркиваниями __dirname) я хочу складывать все в папку dist
		clean: true // подсмотрела в инете, после этой строки можно не подключать clean-webpack-plugin для чистки папки dist от файлов с предыдущей сборки
	},

	resolve: {
		extensions: ['.js', '.json', '.png'],
		alias: {
			'@models': path.resolve(__dirname, 'src/models'), // будет указывать на папку models
			'@': path.resolve(__dirname, 'src') // будет указывать на папку src
		}
	},

	optimization: optimization(),	// функция optimization()  возвращает сгенерированный объект, который выше в константе optimization

	devServer: {
		static: './', // перезагружать страницу автоматически
		port: 4200,
		hot: isDev
	},

	// devtool: isDev ? 'source-map' : '', // устарело
	devtool: isDev ? 'source-map' : false, // для webpack 5

	plugins: [
		new HTMLWebpackPlugin({
			template: './index.html', //  не указываю src, т к прописан context, было './src/index.html'
			minify: { // minify - это флаг
				collapseWhitespace: isProd //если прописать collapseWhitespace: true, то index.html, будет постоянно оптимизирован (минифицирован), мне же надо при сборке продакшн
			}
		}),
		new CopyWebpackPlugin({ // могу переносить фавиконку и иные файлы в dist, это для Webpack 5,ссылка https://webpack.js.org/plugins/copy-webpack-plugin/
			patterns: [
				{
					from: path.resolve(__dirname, 'src/favicon.ico'),
					to: path.resolve(__dirname, 'dist')
				}
			]
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css', // в папке dist создался при сборке отдельный файл css
		}),
		// new EslintWebpackPlugin(),
		// new EslintWebpackPlugin(
			// {
			// extensions: ['js', 'jsx'],
			// exclude: [
			// 	'/node_modules/'
			// ],
			// fix: false,
			// emitError: true,
			// emitWarning: true,
			// failOnError: true
		// }
		// )
	],
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					"css-loader", // Переводит CSS в CommonJS
				],// здесь важен порядок перечисления лоадеров, webpack читает справа налево (снизу вверх)
			},
			{
				test: /\.s[ac]ss$/i, // будет понимать файлы с расширением scss и saas
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					"css-loader",// Переводит CSS в CommonJS
					"sass-loader", // компилирует Sass в CSS
				],
			},
			{
				test: /\.(png|jpg|svg|gif)$/,
				type: 'asset/resource'
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i, //для шрифтов
				type: 'asset/resource' // для версии Webpack 5
			},
			{
				test: /\.xml$/, // для открытия xml файлов
				type: 'asset/resource'
			},
			{
				test: /\.csv$/, // для открытия csv файлов
				type: 'asset/resource'
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/, //мне надо пропустить при обработке кода компилятором Babel, не надо компилировать папку node_modules
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/preset-typescript'
						]
					}
				}
			}
		]
	}
}
