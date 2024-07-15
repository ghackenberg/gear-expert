import url from 'url'
import path from 'path'
import webpack from 'webpack'
import CopyPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config = {
    mode: 'development',
    entry: './src/scripts/main.tsx',
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'public', 'scripts'),
        filename: 'main.js'
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/models', to: 'models' }
            ]
        }),
        new HtmlWebpackPlugin({
            title: 'Gear Expert'
        })
    ]
}

export default config