module.exports = {
	entry: './src/js/main.js',
	output: {
		filename: 'bundle.js',
		path: __dirname
	},
	 module: {
	    rules: [
	      {
	        test: /\.css$/,
	        use: ['style-loader','css-loader']
	      },
	      {
	      	test: /\.svg|png|jpg$/i,
	      	use: [
	      		{ 
	      			loader: 'file-loader'
	      		}
	      	]
	      }
	    ]
	  }
}